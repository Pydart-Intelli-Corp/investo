/**
 * Frontend error handling utilities for consistent UI error messages
 */

// Error message mappings for user-friendly display
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server is temporarily unavailable. Please try again later.',
  
  // Authentication errors
  AUTH_FAILED: 'Invalid email or password. Please check your credentials.',
  INVALID_CREDENTIALS: 'Invalid credentials. Please check your email and password.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in.',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked. Please try again later.',
  
  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  EMAIL_EXISTS: 'An account with this email address already exists.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
  REQUIRED_FIELD: 'This field is required.',
  
  // Registration/Verification errors
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  VERIFICATION_FAILED: 'Verification failed. Please check your code and try again.',
  OTP_EXPIRED: 'Verification code has expired. Please request a new one.',
  OTP_INVALID: 'Invalid verification code. Please check and try again.',
  MAX_ATTEMPTS: 'Maximum verification attempts exceeded. Please request a new code.',
  
  // General errors
  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  ACCESS_DENIED: 'Access denied. You do not have permission to perform this action.',
  OPERATION_FAILED: 'Operation failed. Please try again.',
  
  // File upload errors
  FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please choose a different file.',
  
  // Payment/Transaction errors
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again later.',
  
  // Default fallback
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// HTTP status code to error type mapping
const STATUS_CODE_MESSAGES: Record<number, string> = {
  400: ERROR_MESSAGES.VALIDATION_ERROR,
  401: ERROR_MESSAGES.UNAUTHORIZED,
  403: ERROR_MESSAGES.ACCESS_DENIED,
  404: ERROR_MESSAGES.RESOURCE_NOT_FOUND,
  409: ERROR_MESSAGES.EMAIL_EXISTS,
  422: ERROR_MESSAGES.VALIDATION_ERROR,
  429: 'Too many requests. Please try again later.',
  500: ERROR_MESSAGES.SERVER_ERROR,
  502: ERROR_MESSAGES.SERVER_ERROR,
  503: ERROR_MESSAGES.SERVER_ERROR,
  504: ERROR_MESSAGES.TIMEOUT_ERROR
};

/**
 * Parse API error response and return user-friendly message
 * @param {Response} response - Fetch response object
 * @param {any} data - Parsed response data
 * @returns {string} User-friendly error message
 */
const parseApiError = (response: Response, data: any): string => {
  // First check if there's a specific message in the response
  if (data?.message) {
    // Map common backend messages to user-friendly ones
    const message = data.message.toLowerCase();
    
    if (message.includes('user already exists') || message.includes('already exists')) {
      return ERROR_MESSAGES.EMAIL_EXISTS;
    }
    if (message.includes('invalid credentials')) {
      return ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    if (message.includes('invalid email') || message.includes('invalid password')) {
      return ERROR_MESSAGES.AUTH_FAILED;
    }
    if (message.includes('email not verified') || message.includes('verify your email')) {
      return ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
    }
    if (message.includes('account locked') || message.includes('temporarily locked')) {
      return ERROR_MESSAGES.ACCOUNT_LOCKED;
    }
    if (message.includes('invalid otp') || message.includes('invalid code')) {
      return ERROR_MESSAGES.OTP_INVALID;
    }
    if (message.includes('expired') && message.includes('otp')) {
      return ERROR_MESSAGES.OTP_EXPIRED;
    }
    if (message.includes('maximum') && message.includes('attempts')) {
      return ERROR_MESSAGES.MAX_ATTEMPTS;
    }
    
    // For login-specific errors, return the actual server message if it's descriptive
    if (response.status === 401 && data.message.length > 5) {
      return data.message;
    }
    
    // If it's already user-friendly, return as is
    return data.message;
  }
  
  // Fallback to status code mapping
  return STATUS_CODE_MESSAGES[response.status] || ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * Handle API response and extract error information
 * @param {Response} response - Fetch response object
 * @returns {Promise<{success: boolean, message: string, data?: any, [key: string]: any}>}
 */
const handleApiResponse = async (response: Response): Promise<{success: boolean, message: string, data?: any, [key: string]: any}> => {
  try {
    const data = await response.json();
    
    if (response.ok && data.success !== false) {
      return {
        success: true,
        message: data.message || 'Operation completed successfully',
        data: data.data || data,
        ...data // Preserve any additional properties like requiresVerification
      };
    } else {
      return {
        success: false,
        message: parseApiError(response, data),
        data: data,
        ...data // Preserve any additional properties
      };
    }
  } catch (jsonError) {
    // If JSON parsing fails, it's likely a network or server error
    if (!response.ok) {
      return {
        success: false,
        message: STATUS_CODE_MESSAGES[response.status] || ERROR_MESSAGES.SERVER_ERROR
      };
    }
    
    // JSON parsing failed on successful response
    return {
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR
    };
  }
};

/**
 * Handle network and other fetch errors
 * @param {Error} error - Error object from fetch
 * @returns {string} User-friendly error message
 */
const handleNetworkError = (error: Error): string => {
  if (error.name === 'AbortError') {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }
  
  if (error.message?.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  if (error.message?.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }
  
  // Default network error
  return ERROR_MESSAGES.NETWORK_ERROR;
};

/**
 * Comprehensive API call wrapper with error handling
 * @param {string} url - API endpoint URL  
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<{success: boolean, message: string, data?: any, [key: string]: any}>}
 */
const apiCall = async (url: string, options: RequestInit = {}): Promise<{success: boolean, message: string, data?: any, [key: string]: any}> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>)
      },
      ...options
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    return {
      success: false,
      message: handleNetworkError(error as Error)
    };
  }
};

/**
 * Display error message in UI (can be customized per component)
 * @param {string} message - Error message to display
 * @param {Function} setError - State setter for error message
 * @param {number} duration - How long to show the error (ms)
 */
const showError = (message: string, setError: (error: string) => void, duration = 5000): void => {
  setError(message);
  
  if (duration > 0) {
    setTimeout(() => {
      setError('');
    }, duration);
  }
};

/**
 * Clear all error states
 * @param {Record<string, Function>} errorSetters - Object containing error state setters
 */
const clearErrors = (errorSetters: Record<string, (error: string) => void>): void => {
  Object.values(errorSetters).forEach(setter => {
    if (typeof setter === 'function') {
      setter('');
    }
  });
};

export {
  ERROR_MESSAGES,
  STATUS_CODE_MESSAGES,
  parseApiError,
  handleApiResponse,
  handleNetworkError,
  apiCall,
  showError,
  clearErrors
};