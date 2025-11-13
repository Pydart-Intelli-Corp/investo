const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { User, Portfolio, Transaction, Affiliate } = require('../models');
const { 
  asyncHandler, 
  validationError,
  notFoundError,
  unauthorizedError
} = require('../middleware/errorHandler');
const { handleValidationErrors } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');
const { handleError } = require('../utils/responseHelper');

const router = express.Router();

// @desc    Get user profile/dashboard data
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'phoneNumber',
        'walletAddress', 'walletQRCode', 'isActive', 'isEmailVerified', 
        'isProfileComplete', 'referralCode', 'totalReferrals', 
        'directReferrals', 'walletBalance', 'totalDeposited', 
        'totalWithdrawn', 'totalEarnings', 'totalCommissions',
        'currentRank', 'subscriptionStatus', 'botActive', 'created_at'
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional stats
    const affiliate = await Affiliate.findOne({ 
      where: { userId: user.id },
      attributes: ['totalCommissions', 'totalReferrals', 'directReferrals']
    });

    // Update user data with affiliate info if available
    const profileData = {
      ...user.toJSON(),
      totalCommissions: affiliate?.totalCommissions || user.totalCommissions,
      totalReferrals: affiliate?.totalReferrals || user.totalReferrals,
      directReferrals: affiliate?.directReferrals || user.directReferrals
    };

    res.status(200).json({
      success: true,
      data: profileData
    });

  } catch (error) {
    logger.logError('GET_USER_PROFILE_ERROR', error);
    return handleError(res, error);
  }
});

// @desc    Get user transactions
// @route   GET /api/user/transactions
// @access  Private
const getUserTransactions = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = { userId: req.user.id };
    if (type) whereConditions.type = type;
    if (status) whereConditions.status = status;

    const transactions = await Transaction.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id', 'transactionId', 'type', 'amount', 'currency', 'status',
        'description', 'created_at', 'completedAt', 'balanceBefore', 'balanceAfter'
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: transactions.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(transactions.count / limit),
        totalTransactions: transactions.count,
        hasMore: offset + transactions.rows.length < transactions.count
      }
    });

  } catch (error) {
    logger.logError('GET_USER_TRANSACTIONS_ERROR', error);
    return handleError(res, error);
  }
});

// @desc    Get user referral tree
// @route   GET /api/user/referrals
// @access  Private
const getUserReferrals = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, level } = req.query;
    const offset = (page - 1) * limit;

    // Build referral tree query
    const whereConditions = { referredBy: req.user.id };
    
    // Get direct referrals
    const referrals = await User.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'referralCode',
        'totalReferrals', 'directReferrals', 'totalDeposited',
        'currentRank', 'isActive', 'created_at'
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    // Get referral statistics
    const stats = {
      totalDirectReferrals: await User.count({ where: { referredBy: req.user.id } }),
      activeReferrals: await User.count({ 
        where: { 
          referredBy: req.user.id, 
          isActive: true 
        } 
      }),
      totalCommissionsEarned: await Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          type: 'commission',
          status: 'completed'
        }
      }) || 0
    };

    res.status(200).json({
      success: true,
      data: {
        referrals: referrals.rows,
        stats
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(referrals.count / limit),
        totalReferrals: referrals.count,
        hasMore: offset + referrals.rows.length < referrals.count
      }
    });

  } catch (error) {
    logger.logError('GET_USER_REFERRALS_ERROR', error);
    return handleError(res, error);
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    console.log('Profile update request received from user:', req.user.id);
    console.log('Request body:', req.body);
    
    const {
      firstName,
      lastName,
      phoneNumber,
      walletAddress,
      walletQRCode
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Current user data:', {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      walletAddress: user.walletAddress
    });

    // Update user fields
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (walletAddress !== undefined) updateData.walletAddress = walletAddress;
    if (walletQRCode !== undefined) updateData.walletQRCode = walletQRCode;

    console.log('Update data prepared:', updateData);

    // Check if profile is now complete
    const updatedUser = await user.update(updateData);
    console.log('User updated successfully:', updatedUser.id);
    
    // Update profile completion status
    const isComplete = !!(
      updatedUser.firstName &&
      updatedUser.lastName &&
      updatedUser.phoneNumber &&
      updatedUser.walletAddress &&
      updatedUser.isEmailVerified
    );

    console.log('Profile completion status:', isComplete);

    if (isComplete !== updatedUser.isProfileComplete) {
      await updatedUser.update({ isProfileComplete: isComplete });
      console.log('Profile completion status updated');
    }

    logger.logUserAction(req.user.id, 'PROFILE_UPDATED', {
      updatedFields: Object.keys(updateData)
    });

    console.log('Sending success response');
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
        isProfileComplete: isComplete
      }
    });

  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    logger.logError('UPDATE_USER_PROFILE_ERROR', error);
    return handleError(res, error);
  }
});

// @desc    Get user dashboard statistics
// @route   GET /api/user/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with basic info
    const user = await User.findByPk(userId, {
      attributes: [
        'walletBalance', 'totalDeposited', 'totalWithdrawn', 
        'totalEarnings', 'totalCommissions', 'directReferrals', 
        'totalReferrals', 'currentRank'
      ]
    });

    // Get transaction statistics
    const transactionStats = await Transaction.findAll({
      where: { userId },
      attributes: [
        'type',
        [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'count'],
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('amount')), 'totalAmount']
      ],
      group: ['type'],
      raw: true
    });

    // Get recent activity count (last 30 days)
    const recentActivity = await Transaction.count({
      where: {
        userId,
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Format transaction stats
    const formattedStats = {
      deposits: { count: 0, amount: 0 },
      withdrawals: { count: 0, amount: 0 },
      commissions: { count: 0, amount: 0 },
      earnings: { count: 0, amount: 0 }
    };

    transactionStats.forEach(stat => {
      if (stat.type in formattedStats) {
        formattedStats[stat.type] = {
          count: parseInt(stat.count) || 0,
          amount: parseFloat(stat.totalAmount) || 0
        };
      }
    });

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        transactions: formattedStats,
        recentActivity
      }
    });

  } catch (error) {
    logger.logError('GET_USER_STATS_ERROR', error);
    return handleError(res, error);
  }
});

// Register routes
// @desc    Get available portfolios
// @route   GET /api/user/portfolios
// @access  Private
const getAvailablePortfolios = asyncHandler(async (req, res) => {
  try {
    const { type, category } = req.query;

    // Build where conditions
    const whereConditions = {
      isActive: true,
      isVisible: true
    };

    if (type) whereConditions.type = type;
    if (category) whereConditions.category = category;

    const portfolios = await Portfolio.findAll({
      where: whereConditions,
      attributes: [
        'id', 'name', 'slug', 'description', 'price', 'minInvestment', 
        'maxInvestment', 'durationValue', 'durationUnit', 'dailyROI',
        'totalReturnLimit', 'features', 'type', 'category', 'subscriptionFee',
        'requiresSubscription', 'isElite', 'availableSlots', 'usedSlots',
        'botSettings', 'displayOrder', 'backgroundColor', 'textColor',
        'gradientColorFrom', 'gradientColorTo', 'totalSubscribers'
      ],
      order: [['displayOrder', 'ASC'], ['created_at', 'DESC']]
    });

    // Add calculated fields for each portfolio
    const enrichedPortfolios = portfolios.map(portfolio => {
      const portfolioData = portfolio.toJSON();
      return {
        ...portfolioData,
        availabilityStatus: portfolio.getAvailabilityStatus(),
        remainingSlots: portfolio.getRemainingSlots(),
        formattedPrice: portfolio.getFormattedPrice(),
        investmentRange: portfolio.getInvestmentRange(),
        durationInDays: portfolio.getDurationInDays(),
        totalPossibleReturn: portfolio.getTotalPossibleReturn()
      };
    });

    res.status(200).json({
      success: true,
      data: enrichedPortfolios,
      count: enrichedPortfolios.length
    });

  } catch (error) {
    logger.logError('GET_AVAILABLE_PORTFOLIOS_ERROR', error);
    return handleError(res, error);
  }
});

// @desc    Change user password
// @route   PUT /api/user/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  try {
    console.log('Password change request received from user:', req.user.id);
    console.log('Request body keys:', Object.keys(req.body));
    
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      console.log('Missing password fields:', { currentPassword: !!currentPassword, newPassword: !!newPassword });
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      console.log('New password too short:', newPassword.length);
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Verifying current password for user:', user.email);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    console.log('Password verification result:', isMatch);
    
    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    console.log('Updating password for user:', user.email);
    
    // Update password
    user.password = newPassword;
    await user.save();

    console.log('Password updated successfully');

    logger.logUserAction(req.user.id, 'PASSWORD_CHANGED', {
      timestamp: new Date()
    });

    console.log('Sending success response');
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error in changePassword:', error);
    logger.logError('CHANGE_PASSWORD_ERROR', error);
    return handleError(res, error);
  }
});

// @desc    Send email verification
// @route   POST /api/user/send-verification
// @access  Private
const sendVerificationEmail = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new OTP
    const otp = user.generateEmailOTP();
    await user.save();

    // Send verification email (implement email service)
    // For now, just log the OTP
    logger.logUserAction(req.user.id, 'VERIFICATION_EMAIL_SENT', {
      otp: otp,
      email: user.email
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    logger.logError('SEND_VERIFICATION_EMAIL_ERROR', error);
    return handleError(res, error);
  }
});

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('phoneNumber').optional().trim().isLength({ max: 20 }),
  body('walletAddress').optional().trim().isLength({ max: 100 }),
  body('walletQRCode').optional().trim()
], handleValidationErrors, updateUserProfile);

router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], handleValidationErrors, changePassword);

router.post('/send-verification', protect, sendVerificationEmail);

router.get('/transactions', protect, getUserTransactions);
router.get('/referrals', protect, getUserReferrals);
router.get('/stats', protect, getUserStats);
router.get('/portfolios', protect, getAvailablePortfolios);

module.exports = router;