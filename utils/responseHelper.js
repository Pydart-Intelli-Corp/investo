/**
 * Centralized error response utilities for consistent API responses
 */

// Standard error response format
const createErrorResponse = (message, statusCode = 500, details = null) => {
  return {
    success: false,
    message,
    error: details,
    timestamp: new Date().toISOString()
  };
};

// Standard success response format
const createSuccessResponse = (message, data = null, statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// Error types with consistent messages
const ErrorTypes = {
  VALIDATION_ERROR: 'Invalid input data',
  AUTH_ERROR: 'Authentication failed',
  FORBIDDEN_ERROR: 'Access denied',
  NOT_FOUND_ERROR: 'Resource not found',
  CONFLICT_ERROR: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',
  NETWORK_ERROR: 'Network connection failed',
  TIMEOUT_ERROR: 'Request timeout'
};

// HTTP status codes
const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Send error response
const sendErrorResponse = (res, message, statusCode = 500, details = null) => {
  return res.status(statusCode).json(createErrorResponse(message, statusCode, details));
};

// Send success response
const sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json(createSuccessResponse(message, data, statusCode));
};

// Validation error handler
const handleValidationError = (res, errors) => {
  const firstError = Array.isArray(errors) ? errors[0] : errors;
  const message = typeof firstError === 'string' ? firstError : firstError.msg || firstError.message;
  
  return sendErrorResponse(res, message, StatusCodes.VALIDATION_ERROR, {
    field: firstError.path || firstError.param,
    value: firstError.value
  });
};

// Authentication error handler
const handleAuthError = (res, message = ErrorTypes.AUTH_ERROR) => {
  return sendErrorResponse(res, message, StatusCodes.UNAUTHORIZED);
};

// Authorization error handler
const handleForbiddenError = (res, message = ErrorTypes.FORBIDDEN_ERROR) => {
  return sendErrorResponse(res, message, StatusCodes.FORBIDDEN);
};

// Not found error handler
const handleNotFoundError = (res, message = ErrorTypes.NOT_FOUND_ERROR) => {
  return sendErrorResponse(res, message, StatusCodes.NOT_FOUND);
};

// Conflict error handler
const handleConflictError = (res, message = ErrorTypes.CONFLICT_ERROR) => {
  return sendErrorResponse(res, message, StatusCodes.CONFLICT);
};

// Internal server error handler
const handleInternalError = (res, message = ErrorTypes.INTERNAL_ERROR, error = null) => {
  const details = process.env.NODE_ENV === 'development' ? {
    stack: error?.stack,
    name: error?.name
  } : null;
  
  return sendErrorResponse(res, message, StatusCodes.INTERNAL_ERROR, details);
};

// Generic error handler that determines error type
const handleError = (res, error) => {
  console.error('Error occurred:', error);

  // Handle different error types
  if (error.name === 'ValidationError') {
    return handleValidationError(res, error.errors || error.message);
  }
  
  if (error.name === 'UnauthorizedError' || error.message.includes('unauthorized')) {
    return handleAuthError(res, error.message);
  }
  
  if (error.name === 'ForbiddenError' || error.message.includes('forbidden')) {
    return handleForbiddenError(res, error.message);
  }
  
  if (error.name === 'NotFoundError' || error.message.includes('not found')) {
    return handleNotFoundError(res, error.message);
  }
  
  if (error.name === 'ConflictError' || error.message.includes('already exists')) {
    return handleConflictError(res, error.message);
  }

  // Default to internal server error
  return handleInternalError(res, error.message || ErrorTypes.INTERNAL_ERROR, error);
};

module.exports = {
  createErrorResponse,
  createSuccessResponse,
  ErrorTypes,
  StatusCodes,
  sendErrorResponse,
  sendSuccessResponse,
  handleValidationError,
  handleAuthError,
  handleForbiddenError,
  handleNotFoundError,
  handleConflictError,
  handleInternalError,
  handleError
};