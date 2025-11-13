const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { 
  asyncHandler, 
  validationError, 
  authError
} = require('../middleware/errorHandler');
const { sendTokenResponse } = require('../middleware/auth');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/responseHelper');
const logger = require('../utils/logger');

const router = express.Router();

// User login validation
const userLoginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// @desc    User login
// @route   POST /api/user/login
// @access  Public
const userLogin = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(validationError(errors.array()[0].msg));
  }

  const { email, password } = req.body;

  // Normalize email to lowercase for consistent lookup
  const normalizedEmail = email.toLowerCase().trim();

  // Check for user and include password
  const user = await User.findOne({ 
    where: { email: normalizedEmail },
    attributes: { include: ['password'] }
  });

  if (!user) {
    logger.logAuthAttempt(normalizedEmail, false, req.ip, req.get('User-Agent'));
    return sendErrorResponse(res, 'Invalid credentials', 401);
  }

  // Check if user is a regular user (not admin)
  if (user.role === 'admin' || user.role === 'superadmin') {
    logger.logSecurityEvent(
      'ADMIN_USER_LOGIN_ATTEMPT',
      'Admin user attempted regular user login',
      user.id,
      req.ip,
      req.get('User-Agent')
    );
    return sendErrorResponse(res, 'Please use the admin login portal to access your account.', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    logger.logSecurityEvent(
      'INACTIVE_USER_LOGIN_ATTEMPT',
      'Inactive user attempted login',
      user.id,
      req.ip,
      req.get('User-Agent')
    );
    return sendErrorResponse(res, 'Account has been deactivated. Contact support for assistance.', 401);
  }

  // Check if email is verified (for regular users)
  if (!user.isEmailVerified) {
    logger.logSecurityEvent(
      'UNVERIFIED_USER_LOGIN_ATTEMPT',
      'Unverified user attempted login',
      user.id,
      req.ip,
      req.get('User-Agent')
    );
    
    return res.status(401).json({
      success: false,
      message: 'Please verify your email address before logging in.',
      requiresVerification: true,
      showVerificationPrompt: true,
      data: {
        email: user.email,
        userId: user.id
      },
      timestamp: new Date().toISOString()
    });
  }

  // Check if account is locked
  if (user.getIsLocked && user.getIsLocked()) {
    logger.logSecurityEvent(
      'LOCKED_USER_LOGIN_ATTEMPT',
      'Locked user attempted login',
      user.id,
      req.ip,
      req.get('User-Agent')
    );
    return sendErrorResponse(res, 'Account is temporarily locked due to multiple failed login attempts.', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Increment login attempts
    await user.incLoginAttempts();
    
    logger.logAuthAttempt(email, false, req.ip, req.get('User-Agent'));
    logger.logSecurityEvent(
      'FAILED_USER_LOGIN_ATTEMPT',
      'Invalid password provided for user login',
      user.id,
      req.ip,
      req.get('User-Agent')
    );
    
    return sendErrorResponse(res, 'Invalid credentials', 401);
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Log successful user login
  logger.logUserAction(user.id, 'USER_LOGIN', {
    loginTime: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  logger.logSecurityEvent(
    'USER_LOGIN_SUCCESS',
    'User logged in successfully',
    user.id,
    req.ip,
    req.get('User-Agent')
  );

  sendTokenResponse(user, 200, res, 'Login successful', req);
});

// @desc    Get current logged in user
// @route   GET /api/user/me
// @access  Private (User only)
const getUserMe = asyncHandler(async (req, res, next) => {
  // This will be protected by protect middleware
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    return sendErrorResponse(res, 'User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        currentRank: user.currentRank,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Register routes
router.post('/login', userLoginValidation, userLogin);

module.exports = router;