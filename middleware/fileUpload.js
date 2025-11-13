const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/payment-proofs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination function called for file:', file.originalname);
    console.log('Upload directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-userid-originalname
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '');
    
    const filename = `${timestamp}-${userId}-${basename}${ext}`;
    console.log('Multer filename function called:', {
      originalname: file.originalname,
      userId,
      timestamp,
      ext,
      basename,
      generatedFilename: filename
    });
    cb(null, filename);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  console.log('Multer file filter called:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    console.log('File filter: ACCEPTED');
    cb(null, true);
  } else {
    console.log('File filter: REJECTED - mimetype:', file.mimetype, 'extension:', ext);
    cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
};

// Configure multer with optimized settings
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only one file per request
    fieldSize: 2 * 1024 * 1024, // 2MB field size limit
    fields: 10, // Max 10 fields
    parts: 20 // Max 20 parts
  },
  fileFilter: fileFilter
});

// Middleware wrapper to handle multer errors with timeout protection
const uploadProofImageWithErrorHandling = (req, res, next) => {
  console.log('=== MULTER MIDDLEWARE START ===');
  console.log('Request headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  
  // Set a longer timeout for file uploads
  req.setTimeout(120000); // 2 minutes
  res.setTimeout(120000); // 2 minutes
  
  const startTime = Date.now();
  
  upload.single('proofImage')(req, res, (err) => {
    const processingTime = Date.now() - startTime;
    console.log(`=== MULTER PROCESSING TIME: ${processingTime}ms ===`);
    console.log('=== MULTER MIDDLEWARE RESULT ===');
    
    if (err) {
      console.error('Multer error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      if (err instanceof multer.MulterError) {
        console.error('MulterError type:', err.code);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.',
            error: 'FILE_TOO_LARGE'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Only one file is allowed.',
            error: 'TOO_MANY_FILES'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected field name. Use "proofImage" as the field name.',
            error: 'UNEXPECTED_FIELD'
          });
        }
      } else {
        // Custom error (like from fileFilter)
        return res.status(400).json({
          success: false,
          message: err.message,
          error: 'INVALID_FILE'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + err.message,
        error: 'UPLOAD_ERROR'
      });
    }
    
    console.log('Multer processed successfully');
    console.log('File info:', req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : 'NO FILE');
    
    next();
  });
};

module.exports = {
  uploadProofImage: uploadProofImageWithErrorHandling,
  uploadDir
};