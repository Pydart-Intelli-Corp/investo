const express = require('express');
const router = express.Router();
const { Payment, User, Portfolio, AdminWallet } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');
const responseHelper = require('../utils/responseHelper');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Get all payment requests with filtering and pagination
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 50, 
      paymentType, 
      networkType, 
      startDate,
      endDate,
      userId 
    } = req.query;
    
    const where = {};
    
    // Status filter
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    
    // Payment type filter
    if (paymentType && paymentType !== 'all') {
      where.paymentType = paymentType.toUpperCase();
    }
    
    // Network type filter
    if (networkType && networkType !== 'all') {
      where.networkType = networkType.toUpperCase();
    }
    
    // Date range filter
    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // User filter
    if (userId) {
      where.userId = parseInt(userId);
    }

    const payments = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'referralCode', 'walletBalance']
        },
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'description', 'type']
        },
        {
          model: AdminWallet,
          as: 'adminWallet',
          attributes: ['id', 'walletAddress', 'networkType', 'walletType']
        },
        {
          model: User,
          as: 'processedByUser',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    logger.info('Admin payments fetched', {
      adminId: req.user.id,
      filters: { status, paymentType, networkType },
      totalCount: payments.count,
      page,
      limit
    });

    responseHelper.sendSuccessResponse(res, 'Payment requests retrieved successfully', {
      payments: payments.rows,
      totalCount: payments.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(payments.count / parseInt(limit)),
      hasNextPage: parseInt(page) < Math.ceil(payments.count / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    });

  } catch (error) {
    logger.error('Error fetching admin payments:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id
    });

    responseHelper.sendErrorResponse(res, 'Error fetching payment requests', 500);
  }
});

// Get payment statistics for admin dashboard
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get overall statistics
    const [
      totalPayments,
      pendingPayments,
      completedPayments,
      rejectedPayments,
      todayPayments,
      totalAmountResult,
      completedAmountResult
    ] = await Promise.all([
      Payment.count(),
      Payment.count({ where: { status: 'PENDING' } }),
      Payment.count({ where: { status: 'COMPLETED' } }),
      Payment.count({ where: { status: 'REJECTED' } }),
      Payment.count({ 
        where: { 
          created_at: {
            [Op.between]: [today, tomorrow]
          }
        } 
      }),
      Payment.sum('total_amount'),
      Payment.sum('total_amount', { where: { status: 'COMPLETED' } })
    ]);

    // Get recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentPayments = await Payment.findAll({
      where: {
        created_at: {
          [Op.gte]: weekAgo
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    // Get payments by payment type
    const paymentsByType = await Payment.findAll({
      attributes: [
        'paymentType',
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('total_amount')), 'totalAmount']
      ],
      group: ['paymentType'],
      raw: true
    });

    const stats = {
      totalPayments: totalPayments || 0,
      pendingPayments: pendingPayments || 0,
      completedPayments: completedPayments || 0,
      rejectedPayments: rejectedPayments || 0,
      processingPayments: (totalPayments || 0) - (pendingPayments || 0) - (completedPayments || 0) - (rejectedPayments || 0),
      todayPayments: todayPayments || 0,
      totalAmount: parseFloat(totalAmountResult) || 0,
      completedAmount: parseFloat(completedAmountResult) || 0,
      pendingAmount: 0, // Will calculate below
      recentActivity: recentPayments.map(payment => ({
        id: payment.id,
        userName: `${payment.user.firstName} ${payment.user.lastName}`,
        amount: payment.totalAmount,
        status: payment.status,
        createdAt: payment.createdAt
      })),
      paymentsByType: paymentsByType.map(item => ({
        type: item.paymentType,
        count: parseInt(item.count),
        totalAmount: parseFloat(item.totalAmount) || 0
      }))
    };

    // Calculate pending amount
    const pendingAmountResult = await Payment.sum('totalAmount', { where: { status: 'PENDING' } });
    stats.pendingAmount = parseFloat(pendingAmountResult) || 0;

    logger.info('Admin payment statistics retrieved', {
      adminId: req.user.id,
      stats: {
        total: stats.totalPayments,
        pending: stats.pendingPayments,
        completed: stats.completedPayments
      }
    });

    responseHelper.sendSuccessResponse(res, 'Payment statistics retrieved successfully', stats);

  } catch (error) {
    logger.error('Error fetching payment statistics:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id
    });

    responseHelper.sendErrorResponse(res, 'Error fetching payment statistics', 500);
  }
});

// Get single payment details
router.get('/:paymentId', protect, adminOnly, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      where: { id: paymentId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'referralCode', 'walletBalance', 'created_at']
        },
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'description', 'type', 'minInvestment', 'maxInvestment']
        },
        {
          model: AdminWallet,
          as: 'adminWallet',
          attributes: ['id', 'walletAddress', 'networkType', 'walletType', 'qrCodeImage']
        },
        {
          model: User,
          as: 'processedByUser',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false
        }
      ]
    });

    if (!payment) {
      return responseHelper.sendErrorResponse(res, 'Payment not found', 404);
    }

    logger.info('Admin payment details retrieved', {
      adminId: req.user.id,
      paymentId: payment.id,
      userId: payment.userId
    });

    responseHelper.sendSuccessResponse(res, 'Payment details retrieved successfully', payment);

  } catch (error) {
    logger.error('Error fetching payment details:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id,
      paymentId: req.params.paymentId
    });

    responseHelper.sendErrorResponse(res, 'Error fetching payment details', 500);
  }
});

// Approve payment
router.post('/:paymentId/approve', protect, adminOnly, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user.id;

    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        status: 'PENDING'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'walletBalance']
        },
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'type']
        }
      ]
    });

    if (!payment) {
      return responseHelper.sendErrorResponse(res, 'Payment not found or already processed', 404);
    }

    // Debug: Check adminId value and type
    console.log('DEBUG: adminId value:', adminId);
    console.log('DEBUG: adminId type:', typeof adminId);
    console.log('DEBUG: adminId === "env-admin":', adminId === 'env-admin');
    console.log('DEBUG: processedBy value:', adminId === 'env-admin' ? null : adminId);

    // Update payment status
    await payment.update({
      status: 'COMPLETED',
      processedBy: adminId === 'env-admin' ? null : adminId,
      processedAt: new Date(),
      adminNotes: adminNotes || null
    });

    // Update user wallet balance (add the investment amount, not including subscription fee)
    const user = payment.user;
    const newBalance = parseFloat(user.walletBalance) + parseFloat(payment.amount);
    
    await user.update({
      walletBalance: newBalance
    });

    logger.info('Payment approved by admin', {
      paymentId: payment.id,
      userId: payment.userId,
      adminId,
      amount: payment.amount,
      previousBalance: user.walletBalance,
      newBalance,
      portfolio: payment.portfolio.name
    });

    // TODO: Send notification to user about payment approval
    // Could implement email notification, in-app notification, etc.

    responseHelper.sendSuccessResponse(res, 'Payment approved successfully', {
      paymentId: payment.id,
      status: 'COMPLETED',
      userBalance: newBalance,
      message: 'Payment has been approved and user balance updated'
    });

  } catch (error) {
    logger.error('Error approving payment:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id,
      paymentId: req.params.paymentId
    });

    responseHelper.sendErrorResponse(res, 'Error approving payment', 500);
  }
});

// Reject payment
router.post('/:paymentId/reject', protect, adminOnly, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason, adminNotes } = req.body;
    const adminId = req.user.id;

    if (!reason || !reason.trim()) {
      return responseHelper.sendErrorResponse(res, 'Rejection reason is required', 400);
    }

    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        status: 'PENDING'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'type']
        }
      ]
    });

    if (!payment) {
      return responseHelper.sendErrorResponse(res, 'Payment not found or already processed', 404);
    }

    // Update payment status
    await payment.update({
      status: 'REJECTED',
      processedBy: adminId === 'env-admin' ? null : adminId,
      processedAt: new Date(),
      rejectionReason: reason.trim(),
      adminNotes: adminNotes || null
    });

    logger.info('Payment rejected by admin', {
      paymentId: payment.id,
      userId: payment.userId,
      adminId,
      reason: reason.trim(),
      portfolio: payment.portfolio.name
    });

    // TODO: Send notification to user about payment rejection
    // Could implement email notification with rejection reason

    responseHelper.sendSuccessResponse(res, 'Payment rejected successfully', {
      paymentId: payment.id,
      status: 'REJECTED',
      reason: reason.trim(),
      message: 'Payment has been rejected'
    });

  } catch (error) {
    logger.error('Error rejecting payment:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id,
      paymentId: req.params.paymentId
    });

    responseHelper.sendErrorResponse(res, 'Error rejecting payment', 500);
  }
});

// Update payment notes (admin can add internal notes)
router.put('/:paymentId/notes', protect, adminOnly, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { adminNotes } = req.body;
    const adminId = req.user.id;

    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return responseHelper.sendErrorResponse(res, 'Payment not found', 404);
    }

    await payment.update({
      adminNotes: adminNotes || null
    });

    logger.info('Payment notes updated by admin', {
      paymentId: payment.id,
      adminId,
      hasNotes: !!adminNotes
    });

    responseHelper.sendSuccessResponse(res, 'Payment notes updated successfully', {
      paymentId: payment.id,
      adminNotes: payment.adminNotes
    });

  } catch (error) {
    logger.error('Error updating payment notes:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id,
      paymentId: req.params.paymentId
    });

    responseHelper.sendErrorResponse(res, 'Error updating payment notes', 500);
  }
});

// Bulk actions for multiple payments
router.post('/bulk-action', protect, adminOnly, async (req, res) => {
  try {
    const { action, paymentIds, reason, adminNotes } = req.body;
    const adminId = req.user.id;

    if (!action || !paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return responseHelper.sendErrorResponse(res, 'Invalid bulk action request', 400);
    }

    if (action === 'reject' && (!reason || !reason.trim())) {
      return responseHelper.sendErrorResponse(res, 'Rejection reason is required for bulk reject', 400);
    }

    const validActions = ['approve', 'reject'];
    if (!validActions.includes(action)) {
      return responseHelper.sendErrorResponse(res, 'Invalid action. Allowed: approve, reject', 400);
    }

    // Find all pending payments
    const payments = await Payment.findAll({
      where: {
        id: { [Op.in]: paymentIds },
        status: 'PENDING'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'walletBalance']
        }
      ]
    });

    if (payments.length === 0) {
      return responseHelper.sendErrorResponse(res, 'No pending payments found with provided IDs', 404);
    }

    const results = [];
    const now = new Date();

    for (const payment of payments) {
      try {
        if (action === 'approve') {
          // Update payment
          await payment.update({
            status: 'COMPLETED',
            processedBy: adminId === 'env-admin' ? null : adminId,
            processedAt: now,
            adminNotes: adminNotes || null
          });

          // Update user balance
          const newBalance = parseFloat(payment.user.walletBalance) + parseFloat(payment.amount);
          await payment.user.update({ walletBalance: newBalance });

          results.push({
            paymentId: payment.id,
            status: 'success',
            action: 'approved',
            newBalance
          });

        } else if (action === 'reject') {
          await payment.update({
            status: 'REJECTED',
            processedBy: adminId === 'env-admin' ? null : adminId,
            processedAt: now,
            rejectionReason: reason.trim(),
            adminNotes: adminNotes || null
          });

          results.push({
            paymentId: payment.id,
            status: 'success',
            action: 'rejected'
          });
        }
      } catch (paymentError) {
        results.push({
          paymentId: payment.id,
          status: 'error',
          error: paymentError.message
        });
      }
    }

    logger.info('Bulk payment action completed', {
      adminId,
      action,
      totalPayments: paymentIds.length,
      processedPayments: payments.length,
      successCount: results.filter(r => r.status === 'success').length,
      errorCount: results.filter(r => r.status === 'error').length
    });

    responseHelper.sendSuccessResponse(res, `Bulk ${action} completed`, {
      action,
      results,
      totalRequested: paymentIds.length,
      totalProcessed: payments.length,
      successCount: results.filter(r => r.status === 'success').length,
      errorCount: results.filter(r => r.status === 'error').length
    });

  } catch (error) {
    logger.error('Error in bulk payment action:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id
    });

    responseHelper.sendErrorResponse(res, 'Error processing bulk action', 500);
  }
});

module.exports = router;