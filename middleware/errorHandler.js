const logger = require('../utils/logger');
const { createErrorResponse } = require('../utils/responseHelper');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.logError(err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = { message, statusCode: 400 };
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    const message = 'Too many requests, please try again later';
    error = { message, statusCode: 429 };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Send consistent error response
  const errorResponse = createErrorResponse(
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
      details: error
    } : null
  );

  res.status(statusCode).json(errorResponse);
};

// 404 handler middleware
const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  
  logger.info('404 - Route Not Found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    error: {
      message
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error handler
const validationError = (message, statusCode = 400) => {
  return new AppError(message, statusCode, 'VALIDATION_ERROR');
};

// Authentication error handler
const authError = (message = 'Authentication required', statusCode = 401) => {
  return new AppError(message, statusCode, 'AUTH_ERROR');
};

// Authorization error handler
const authorizationError = (message = 'Access denied', statusCode = 403) => {
  return new AppError(message, statusCode, 'AUTHORIZATION_ERROR');
};

// Not found error handler
const notFoundError = (message = 'Resource not found', statusCode = 404) => {
  return new AppError(message, statusCode, 'NOT_FOUND_ERROR');
};

// Conflict error handler
const conflictError = (message = 'Resource conflict', statusCode = 409) => {
  return new AppError(message, statusCode, 'CONFLICT_ERROR');
};

// Rate limit error handler
const rateLimitError = (message = 'Too many requests', statusCode = 429) => {
  return new AppError(message, statusCode, 'RATE_LIMIT_ERROR');
};

// Server error handler
const serverError = (message = 'Internal server error', statusCode = 500) => {
  return new AppError(message, statusCode, 'SERVER_ERROR');
};

// Database error handler
const databaseError = (message = 'Database error', statusCode = 500) => {
  return new AppError(message, statusCode, 'DATABASE_ERROR');
};

// File upload error handler
const fileUploadError = (message = 'File upload error', statusCode = 400) => {
  return new AppError(message, statusCode, 'FILE_UPLOAD_ERROR');
};

// Email error handler
const emailError = (message = 'Email service error', statusCode = 500) => {
  return new AppError(message, statusCode, 'EMAIL_ERROR');
};

// Payment error handler
const paymentError = (message = 'Payment processing error', statusCode = 400) => {
  return new AppError(message, statusCode, 'PAYMENT_ERROR');
};

// Commission error handler
const commissionError = (message = 'Commission processing error', statusCode = 400) => {
  return new AppError(message, statusCode, 'COMMISSION_ERROR');
};

// Withdrawal error handler
const withdrawalError = (message = 'Withdrawal processing error', statusCode = 400) => {
  return new AppError(message, statusCode, 'WITHDRAWAL_ERROR');
};

// Bot error handler
const botError = (message = 'Bot processing error', statusCode = 500) => {
  return new AppError(message, statusCode, 'BOT_ERROR');
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  AppError,
  validationError,
  authError,
  authorizationError,
  notFoundError,
  conflictError,
  rateLimitError,
  serverError,
  databaseError,
  fileUploadError,
  emailError,
  paymentError,
  commissionError,
  withdrawalError,
  botError
};