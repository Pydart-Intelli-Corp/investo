const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Payment, User, Portfolio, AdminWallet } = require('../models');
const { protect } = require('../middleware/auth');
const responseHelper = require('../utils/responseHelper');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payment-screenshots');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `payment_${userId}_${timestamp}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Submit payment
router.post('/submit', protect, upload.single('screenshot'), async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      portfolioId,
      amount,
      subscriptionFee,
      totalAmount,
      adminWalletId,
      paymentType,
      networkType,
      transactionHash
    } = req.body;

    // Validate required fields
    if (!portfolioId || !amount || !totalAmount || !adminWalletId) {
      return responseHelper.sendErrorResponse(res, 'Missing required payment information', 400);
    }

    if (!req.file) {
      return responseHelper.sendErrorResponse(res, 'Payment screenshot is required', 400);
    }

    // Verify portfolio exists
    const portfolio = await Portfolio.findByPk(portfolioId);
    if (!portfolio) {
      return responseHelper.sendErrorResponse(res, 'Portfolio not found', 404);
    }

    // Verify admin wallet exists
    const adminWallet = await AdminWallet.findByPk(adminWalletId);
    if (!adminWallet) {
      return responseHelper.sendErrorResponse(res, 'Admin wallet not found', 404);
    }

    // Create payment record
    const screenshotPath = `/uploads/payment-screenshots/${req.file.filename}`;
    const screenshotUrl = `${req.protocol}://${req.get('host')}${screenshotPath}`;

    const payment = await Payment.create({
      userId,
      portfolioId: parseInt(portfolioId),
      amount: parseFloat(amount),
      subscriptionFee: parseFloat(subscriptionFee || 25),
      totalAmount: parseFloat(totalAmount),
      paymentType: paymentType || 'USDT',
      networkType: networkType || 'BEP20',
      adminWalletId: parseInt(adminWalletId),
      paymentScreenshot: screenshotPath,
      screenshotUrl,
      transactionHash: transactionHash || null,
      status: 'PENDING'
    });

    logger.info(`Payment submitted - ID: ${payment.id}, User: ${userId}, Portfolio: ${portfolioId}, Amount: ${totalAmount}`);

    // TODO: Send notification to admin panel (implement based on your notification system)
    // This could be via email, database notification, websocket, etc.

    responseHelper.sendSuccessResponse(res, 'Payment submitted for review', {
      paymentId: payment.id,
      status: payment.status,
      message: 'Payment submitted successfully'
    }, 201);

  } catch (error) {
    logger.error('Error submitting payment:', error);
    
    // Clean up uploaded file if payment creation failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error('Error deleting uploaded file:', unlinkError);
      }
    }

    responseHelper.sendErrorResponse(res, 'Failed to submit payment', 500);
  }
});

// Get payment status
router.get('/status/:paymentId', protect, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        userId
      },
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!payment) {
      return responseHelper.sendErrorResponse(res, 'Payment not found', 404);
    }

    responseHelper.sendSuccessResponse(res, 'Payment status retrieved', payment);

  } catch (error) {
    logger.error('Error fetching payment status:', error);
    responseHelper.sendErrorResponse(res, 'Failed to fetch payment status', 500);
  }
});

// Get user's payment history
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;

    const payments = await Payment.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    responseHelper.sendSuccessResponse(res, 'Payment history retrieved', {
      payments: payments.rows,
      totalCount: payments.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(payments.count / limit)
    });

  } catch (error) {
    logger.error('Error fetching payment history:', error);
    responseHelper.sendErrorResponse(res, 'Failed to fetch payment history', 500);
  }
});

module.exports = router;