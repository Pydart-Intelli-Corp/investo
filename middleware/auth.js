const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const { asyncHandler, authError, authorizationError } = require('./errorHandler');
const logger = require('../utils/logger');

// Protect routes - require authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists and is not empty
  if (!token || token === 'null' || token === 'undefined') {
    logger.logSecurityEvent(
      'UNAUTHORIZED_ACCESS_ATTEMPT',
      'No token provided or invalid token format',
      null,
      req.ip,
      req.get('User-Agent')
    );
    return next(authError('Access denied. No token provided.'));
  }

  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Handle environment admin user
    if (decoded.id === 'env-admin') {
      // Create virtual user object for environment admin
      req.user = {
        id: 'env-admin',
        email: process.env.ADMIN_EMAIL || 'admin@investogold.com',
        firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
        lastName: process.env.ADMIN_LAST_NAME || 'User',
        role: 'superadmin',
        isActive: true,
        isEmailVerified: true,
        currentRank: 'Admin',
        lastLogin: new Date(),
        createdAt: new Date()
      };
      return next();
    }

    // Get user from token (for database users)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      logger.logSecurityEvent(
        'INVALID_TOKEN',
        'User not found for token',
        decoded.id,
        req.ip,
        req.get('User-Agent')
      );
      return next(authError('Access denied. User not found.'));
    }

    // Check if user is active
    if (!user.isActive) {
      logger.logSecurityEvent(
        'INACTIVE_USER_ACCESS',
        'Inactive user attempted access',
        user._id,
        req.ip,
        req.get('User-Agent')
      );
      return next(authError('Account has been deactivated.'));
    }

    // Check if user account is locked
    if (user.getIsLocked && user.getIsLocked()) {
      logger.logSecurityEvent(
        'LOCKED_USER_ACCESS',
        'Locked user attempted access',
        user.id,
        req.ip,
        req.get('User-Agent')
      );
      return next(authError('Account is temporarily locked due to security reasons.'));
    }

    // Update last activity (only for database users)
    if (user.save) {
      user.lastActivity = new Date();
      await user.save({ validateBeforeSave: false });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.logSecurityEvent(
      'TOKEN_VERIFICATION_FAILED',
      `${error.name}: ${error.message}`,
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    if (error.name === 'TokenExpiredError') {
      return next(authError('Token has expired. Please login again.'));
    } else if (error.name === 'JsonWebTokenError') {
      return next(authError('Invalid token format. Please login again.'));
    } else if (error.name === 'NotBeforeError') {
      return next(authError('Token not active yet. Please login again.'));
    } else {
      return next(authError('Token verification failed. Please login again.'));
    }
  }
});

// Admin only access
const adminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(authError('Authentication required.'));
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    logger.logSecurityEvent(
      'UNAUTHORIZED_ADMIN_ACCESS',
      'Non-admin user attempted admin access',
      req.user.id,
      req.ip,
      req.get('User-Agent')
    );
    return next(authorizationError('Access denied. Admin privileges required.'));
  }

  next();
});

// Super admin only access
const superAdminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(authError('Authentication required.'));
  }

  if (req.user.role !== 'superadmin') {
    logger.logSecurityEvent(
      'UNAUTHORIZED_SUPERADMIN_ACCESS',
      'Non-superadmin user attempted superadmin access',
      req.user.id,
      req.ip,
      req.get('User-Agent')
    );
    return next(authorizationError('Access denied. Super admin privileges required.'));
  }

  next();
});

// Optional authentication (doesn't throw error if no token)
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (user && user.isActive && !(user.getIsLocked && user.getIsLocked())) {
        user.lastActivity = new Date();
        await user.save({ validateBeforeSave: false });
        req.user = user;
      }
    } catch (error) {
      // Silently ignore authentication errors for optional auth
      logger.logSecurityEvent(
        'OPTIONAL_AUTH_FAILED',
        error.message,
        null,
        req.ip,
        req.get('User-Agent')
      );
    }
  }

  next();
});

// Check if user owns resource or is admin
const ownerOrAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(authError('Authentication required.'));
  }

  const resourceUserId = req.params.userId || req.params.id;
  
  // Allow if user is admin/superadmin or owns the resource
  if (req.user.role === 'admin' || 
      req.user.role === 'superadmin' || 
      req.user.id.toString() === resourceUserId) {
    return next();
  }

  logger.logSecurityEvent(
    'UNAUTHORIZED_RESOURCE_ACCESS',
    'User attempted to access resource they do not own',
    req.user.id,
    req.ip,
    req.get('User-Agent')
  );

  return next(authorizationError('Access denied. You can only access your own resources.'));
});

// Check if profile is complete
const requireCompleteProfile = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(authError('Authentication required.'));
  }

  if (!req.user.isProfileComplete) {
    return next(authorizationError('Please complete your profile to access this feature.'));
  }

  next();
});

// Check if email is verified
const requireEmailVerification = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(authError('Authentication required.'));
  }

  if (!req.user.isEmailVerified) {
    return next(authorizationError('Please verify your email address to access this feature.'));
  }

  next();
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Verify refresh token
const verifyRefreshToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(
      token, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success', req = null) => {
  // Create token
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Cookie options
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Log successful authentication
  if (req) {
    logger.logAuthAttempt(user.email, true, req.ip, req.get('User-Agent'));
  }
  logger.logUserAction(user.id, 'TOKEN_GENERATED', { 
    loginTime: new Date().toISOString() 
  });

  res
    .status(statusCode)
    .cookie('token', token, options)
    .cookie('refreshToken', refreshToken, { ...options, httpOnly: true })
    .json({
      success: true,
      message,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          isProfileComplete: user.isProfileComplete,
          currentRank: user.currentRank,
          walletBalance: user.walletBalance,
          referralCode: user.referralCode,
          createdAt: user.createdAt
        }
      },
      timestamp: new Date().toISOString()
    });
};

// Rate limiting for authentication attempts
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.logSecurityEvent(
      'AUTH_RATE_LIMIT_EXCEEDED',
      'IP exceeded authentication rate limit',
      null,
      req.ip,
      req.get('User-Agent')
    );
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED'
      }
    });
  }
});

module.exports = {
  protect,
  adminOnly,
  superAdminOnly,
  optionalAuth,
  ownerOrAdmin,
  requireCompleteProfile,
  requireEmailVerification,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  sendTokenResponse,
  authRateLimit
};