const { validationResult } = require('express-validator');
const { validationError } = require('./errorHandler');

// Validation middleware to check for express-validator errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors found:', errors.array());
    console.log('Request body:', req.body);
    return next(validationError(errors.array()[0].msg));
  }
  next();
};

module.exports = {
  handleValidationErrors
};