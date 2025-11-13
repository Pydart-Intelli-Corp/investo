const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const User = require('../models/User');
const Affiliate = require('../models/Affiliate');
const { 
  asyncHandler, 
  validationError, 
  authError, 
  conflictError,
  notFoundError 
} = require('../middleware/errorHandler');
const { 
  protect, 
  sendTokenResponse, 
  generateToken, 
  generateRefreshToken,
  verifyRefreshToken 
} = require('../middleware/auth');
const logger = require('../utils/logger');
const { sendOTPEmail, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/emailService');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('firstName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('referralCode')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Referral code must be between 3 and 20 characters'),
  body('phoneNumber')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must not exceed 20 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
];

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    return next(validationError(errors.array()[0].msg));
  }

  const { email, password, firstName, lastName, referralCode } = req.body;

  // Normalize email to lowercase for consistent storage and lookup
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    logger.logSecurityEvent(
      'DUPLICATE_REGISTRATION_ATTEMPT',
      'Attempted registration with existing email',
      null,
      req.ip,
      req.get('User-Agent')
    );
    return next(conflictError('User already exists with this email address'));
  }

  // Find referrer by referral code (optional)
  let referrer = null;
  let referralLevel = 0;
  
  if (referralCode) {
    referrer = await User.findOne({ 
      where: { 
        referralCode: referralCode.toUpperCase(),
        isActive: true 
      } 
    });
    
    if (!referrer) {
      return next(validationError('Invalid or inactive referral code'));
    }

    referralLevel = referrer.referralLevel + 1;
    
    // Check if referral level exceeds maximum (15 levels)
    if (referralLevel > 15) {
      return next(validationError('Maximum referral depth of 15 levels exceeded'));
    }
  }

  try {
    // Generate unique referral code for new user
    let newReferralCode;
    do {
      newReferralCode = `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    } while (await User.findOne({ where: { referralCode: newReferralCode } }));

    // Create user
    const user = await User.create({
      email: normalizedEmail,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: req.body.phoneNumber || '',
      referredBy: referrer ? referrer.id : null,
      referralLevel,
      referralCode: newReferralCode,
      isEmailVerified: false
    });

    // Generate and send OTP
    const otp = await user.generateEmailOTP();
    await user.save();

    // Create affiliate record
    const affiliate = await Affiliate.create({
      userId: user.id,
      referralCode: user.referralCode,
      referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`,
      totalReferrals: 0,
      directReferrals: 0,
      totalCommissions: 0
    });

    // Update referrer's referral count (only if referrer exists)
    if (referrer) {
      await referrer.increment('directReferrals');
      await referrer.increment('totalReferrals');

      // Update affiliate record
      const referrerAffiliate = await Affiliate.findOne({ where: { userId: referrer.id } });
      if (referrerAffiliate) {
        await referrerAffiliate.increment('totalReferrals');
        await referrerAffiliate.increment('directReferrals');
      }

      logger.logUserAction(referrer.id, 'NEW_REFERRAL', {
        newUserId: user.id,
        newUserEmail: user.email,
        level: 1
      });
    }

    // Send OTP email
    const emailResult = await sendOTPEmail(
      user.email, 
      user.firstName || 'User', 
      otp
    );

    if (!emailResult.success) {
      logger.error('Failed to send verification email during registration', emailResult.error);
      // Don't fail registration if email fails, but log the error
    }

    // Log registration
    logger.logUserAction(user.id, 'USER_REGISTERED', {
      email: user.email,
      hasReferrer: !!referrer,
      referrerEmail: referrer ? referrer.email : null,
      referralCode: referralCode || null,
      emailSent: emailResult.success
    });

    // Send response without token - user needs to verify email first
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account before logging in.',
      data: {
        email: user.email,
        firstName: user.firstName,
        emailSent: emailResult.success
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.logError(error, { 
      context: 'User Registration',
      email,
      referralCode 
    });
    return next(error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
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
    return next(authError('Invalid email or password'));
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
    return next(authError('Account has been deactivated. Contact support for assistance.'));
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    logger.logSecurityEvent(
      'UNVERIFIED_USER_LOGIN_ATTEMPT',
      'Unverified user attempted login',
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    // Return response asking user if they want to receive verification code
    return res.status(200).json({
      success: false,
      requiresVerification: true,
      showVerificationPrompt: true,
      message: 'Your email address needs to be verified before you can log in.',
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
    return next(authError('Account is temporarily locked due to multiple failed login attempts. Try again later.'));
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Increment login attempts
    await user.incLoginAttempts();
    
    logger.logAuthAttempt(email, false, req.ip, req.get('User-Agent'));
    logger.logSecurityEvent(
      'FAILED_LOGIN_ATTEMPT',
      'Invalid password provided',
      user.id,
      req.ip,
      req.get('User-Agent')
    );
    
    return next(authError('Invalid email or password'));
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Log successful login
  logger.logUserAction(user.id, 'USER_LOGIN', {
    loginTime: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  sendTokenResponse(user, 200, res, 'Login successful', req);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  // Clear cookies
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  logger.logUserAction(req.user.id, 'USER_LOGOUT', {
    logoutTime: new Date().toISOString()
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    timestamp: new Date().toISOString()
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate('activeSubscription', 'name type dailyROI duration')
    .select('-password');

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        walletAddress: user.walletAddress,
        walletQRCode: user.walletQRCode,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        currentRank: user.currentRank,
        walletBalance: user.walletBalance,
        totalDeposited: user.totalDeposited,
        totalWithdrawn: user.totalWithdrawn,
        totalEarnings: user.totalEarnings,
        totalCommissions: user.totalCommissions,
        referralCode: user.referralCode,
        referralLink: user.referralLink,
        totalReferrals: user.totalReferrals,
        directReferrals: user.directReferrals,
        activeSubscription: user.activeSubscription,
        subscriptionStatus: user.subscriptionStatus,
        botActive: user.botActive,
        dailyROI: user.dailyROI,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(authError('Refresh token is required'));
  }

  try {
    // Verify refresh token
    const decoded = await verifyRefreshToken(token);

    // Get user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(authError('Invalid refresh token'));
    }

    // Generate new access token
    const newAccessToken = generateToken(user._id);

    logger.logUserAction(user.id, 'TOKEN_REFRESHED', {
      refreshTime: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.logSecurityEvent(
      'INVALID_REFRESH_TOKEN',
      'Invalid refresh token used',
      null,
      req.ip,
      req.get('User-Agent')
    );
    return next(authError('Invalid refresh token'));
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(validationError(errors.array()[0].msg));
  }

  const { email } = req.body;

  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

  if (!user) {
    // Don't reveal that user doesn't exist
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      timestamp: new Date().toISOString()
    });
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  logger.logUserAction(user.id, 'PASSWORD_RESET_REQUESTED', {
    resetTime: new Date().toISOString(),
    ip: req.ip
  });

  // Send password reset email
  try {
    await sendPasswordResetEmail(user.email, user.firstName, resetToken);
    
    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email address.',
      timestamp: new Date().toISOString()
    });
  } catch (emailError) {
    // Log the email error but don't reveal it to the user for security
    logger.error('Failed to send password reset email:', emailError);
    
    // Reset the token since email failed
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(new Error('Failed to send password reset email. Please try again later.'));
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(validationError(errors.array()[0].msg));
  }

  const { token, password } = req.body;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: resetPasswordToken,
      passwordResetExpires: { [Op.gt]: new Date() }
    }
  });

  if (!user) {
    return next(validationError('Invalid or expired password reset token'));
  }

  // Set new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await user.save();

  logger.logUserAction(user.id, 'PASSWORD_RESET_COMPLETED', {
    resetTime: new Date().toISOString(),
    ip: req.ip
  });

  sendTokenResponse(user, 200, res, 'Password reset successful', req);
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(validationError('Current password and new password are required'));
  }

  if (newPassword.length < 6 || newPassword.length > 128) {
    return next(validationError('New password must be between 6 and 128 characters'));
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    return next(validationError('New password must contain at least one lowercase letter, one uppercase letter, and one number'));
  }

  // Get user with password
  const user = await User.findByPk(req.user.id, {
    attributes: { include: ['password'] }
  });

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(authError('Current password is incorrect'));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.logUserAction(user.id, 'PASSWORD_CHANGED', {
    changeTime: new Date().toISOString(),
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    timestamp: new Date().toISOString()
  });
});

// Apply routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.put('/change-password', protect, changePassword);

// @desc    Validate referral code
// @route   GET /api/auth/validate-referral/:code
// @access  Public
const validateReferralCode = asyncHandler(async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Referral code is required'
      });
    }

    // Find user with this referral code
    const referrer = await User.findOne({
      where: { 
        referralCode: code.toUpperCase(),
        isActive: true 
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'referralCode', 'currentRank']
    });

    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Valid referral code',
      data: {
        referrerId: referrer.id,
        firstName: referrer.firstName,
        lastName: referrer.lastName,
        email: referrer.email,
        referralCode: referrer.referralCode,
        rank: referrer.currentRank
      }
    });

  } catch (error) {
    logger.logError('VALIDATE_REFERRAL_ERROR', error);
    res.status(500).json({
      success: false,
      message: 'Error validating referral code',
      error: error.message
    });
  }
});

// Register referral validation route
router.get('/validate-referral/:code', validateReferralCode);

// @desc    Verify email address
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(validationError('Verification token is required'));
  }

  // Find user with valid verification token
  const user = await User.findOne({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { [Op.gt]: new Date() },
      isEmailVerified: false
    }
  });

  if (!user) {
    return next(validationError('Invalid or expired verification token'));
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  // Send welcome email
  const welcomeEmailResult = await sendWelcomeEmail(
    user.email, 
    user.firstName || 'User'
  );

  if (!welcomeEmailResult.success) {
    logger.error('Failed to send welcome email after verification', welcomeEmailResult.error);
  }

  // Log email verification
  logger.logUserAction(user.id, 'EMAIL_VERIFIED', {
    verificationTime: new Date().toISOString(),
    ip: req.ip,
    welcomeEmailSent: welcomeEmailResult.success
  });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully! You can now log in to your account.',
    data: {
      email: user.email,
      firstName: user.firstName,
      welcomeEmailSent: welcomeEmailResult.success
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(validationError('Email address is required'));
  }

  // Find unverified user
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      isEmailVerified: false
    }
  });

  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json({
      success: true,
      message: 'If an unverified account with that email exists, a new verification email has been sent.',
      timestamp: new Date().toISOString()
    });
  }

  // Generate new verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  user.emailVerificationToken = emailVerificationToken;
  user.emailVerificationExpires = emailVerificationExpires;
  await user.save();

  // Send verification email
  const emailResult = await sendVerificationEmail(
    user.email, 
    user.firstName || 'User', 
    emailVerificationToken
  );

  if (!emailResult.success) {
    logger.error('Failed to resend verification email', emailResult.error);
    return next(new Error('Failed to send verification email. Please try again later.'));
  }

  // Log resend action
  logger.logUserAction(user.id, 'VERIFICATION_EMAIL_RESENT', {
    resendTime: new Date().toISOString(),
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Verification email has been sent. Please check your inbox.',
    timestamp: new Date().toISOString()
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(validationError('Email and OTP are required'));
  }

  // Find user
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      isEmailVerified: false
    }
  });

  if (!user) {
    return next(validationError('User not found or already verified'));
  }

  // Verify OTP
  const isValid = await user.verifyOTP(otp);

  if (!isValid) {
    logger.logSecurityEvent(
      'INVALID_OTP_ATTEMPT',
      'Invalid OTP verification attempt',
      user.id,
      req.ip,
      req.get('User-Agent')
    );
    
    // Check if user has exceeded maximum attempts
    if (user.otpAttempts >= 5) {
      return next(validationError('Maximum OTP attempts exceeded. Please request a new OTP.'));
    }
    
    return next(validationError(`Invalid OTP code. ${5 - user.otpAttempts} attempts remaining.`));
  }

  // Mark email as verified and clear OTP data
  user.isEmailVerified = true;
  await user.clearOTP();
  await user.save();

  // Send welcome email
  const welcomeEmailResult = await sendWelcomeEmail(
    user.email, 
    user.firstName || 'User'
  );

  if (!welcomeEmailResult.success) {
    logger.error('Failed to send welcome email after OTP verification', welcomeEmailResult.error);
  }

  // Generate JWT tokens for automatic login
  const token = generateToken(user.id);
  const refreshTokenValue = generateRefreshToken(user.id);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Log successful verification
  logger.logUserAction(user.id, 'EMAIL_VERIFIED_VIA_OTP', {
    verificationTime: new Date().toISOString(),
    ip: req.ip,
    welcomeEmailSent: welcomeEmailResult.success,
    autoLoginToken: 'generated'
  });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully! Redirecting to your dashboard...',
    autoLogin: true,
    data: {
      token,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete
      },
      redirectTo: user.role === 'admin' || user.role === 'superadmin' ? '/adminpanel/dashboard' : '/dashboard',
      welcomeEmailSent: welcomeEmailResult.success
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(validationError('Email address is required'));
  }

  // Find unverified user
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      isEmailVerified: false
    }
  });

  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json({
      success: true,
      message: 'If an unverified account with that email exists, a new OTP has been sent.',
      timestamp: new Date().toISOString()
    });
  }

  // Generate new OTP
  const otp = await user.generateEmailOTP();
  await user.save();

  // Send OTP email
  const emailResult = await sendOTPEmail(
    user.email, 
    user.firstName || 'User', 
    otp
  );

  if (!emailResult.success) {
    logger.error('Failed to resend OTP email', emailResult.error);
    return next(new Error('Failed to send OTP email. Please try again later.'));
  }

  // Log resend action
  logger.logUserAction(user.id, 'OTP_RESENT', {
    resendTime: new Date().toISOString(),
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'A new OTP has been sent to your email address.',
    timestamp: new Date().toISOString()
  });
});

/**
 * Send verification OTP for login attempts
 * POST /auth/send-verification-otp
 * Used when user clicks "Send Verification Code" in verification prompt
 */
const sendVerificationOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(validationError('Email is required'));
  }

  // Normalize email to lowercase for consistent lookup
  const normalizedEmail = email.toLowerCase().trim();

  // Find user with unverified email
  const user = await User.findOne({
    where: {
      email: normalizedEmail,
      isEmailVerified: false
    }
  });

  if (!user) {
    return next(validationError('User not found or email already verified'));
  }

  try {
    // Generate new OTP
    const otp = await user.generateEmailOTP();
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(
      user.email, 
      user.firstName || 'User', 
      otp
    );

    if (!emailResult.success) {
      logger.error('Failed to send verification OTP email', emailResult.error);
      return next(new Error('Failed to send verification code. Please try again later.'));
    }

    // Log OTP send action
    logger.logUserAction(user.id, 'VERIFICATION_OTP_SENT_FROM_LOGIN', {
      sentTime: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email address.',
      data: {
        email: user.email,
        redirectTo: '/verify-otp'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.logError(error, { 
      context: 'Send Verification OTP',
      userId: user.id,
      email: user.email 
    });
    return next(new Error('Failed to send verification code. Please try again.'));
  }
});

// Register email verification routes
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/send-verification-otp', sendVerificationOTP);

module.exports = router;