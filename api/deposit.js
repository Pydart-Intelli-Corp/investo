const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Portfolio, Transaction, AdminWallet } = require('../models');
const { sequelize } = require('../config/database');
const { 
  asyncHandler, 
  validationError,
  notFoundError,
  unauthorizedError
} = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const { uploadProofImage } = require('../middleware/fileUpload');
const logger = require('../utils/logger');
const crypto = require('crypto');
const path = require('path');

const router = express.Router();

// @desc    Get available payment methods and wallet addresses
// @route   GET /api/deposit/payment-methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
  try {
    // Get active admin wallets
    const activeWallets = await AdminWallet.findAll({
      where: { isActive: true },
      attributes: [
        'id',
        'walletType',
        'walletAddress',
        'qrCodeImage',
        'networkType',
        'description'
      ],
      order: [['walletType', 'ASC']]
    });

    if (activeWallets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No payment methods are currently available. Please contact support.'
      });
    }

    // Format for frontend
    const paymentMethods = activeWallets.map(wallet => ({
      id: wallet.id,
      currency: wallet.walletType,
      walletAddress: wallet.walletAddress,
      qrCodeImage: wallet.qrCodeImage,
      networkType: wallet.networkType,
      description: wallet.description
    }));

    res.status(200).json({
      success: true,
      data: paymentMethods,
      count: paymentMethods.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.logError('GET_PAYMENT_METHODS_ERROR', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment methods'
    });
  }
});

// @desc    Get deposit information for a portfolio subscription
// @route   POST /api/deposit/initialize
// @access  Private
const initializeDeposit = asyncHandler(async (req, res) => {
  try {
    const { portfolioId, investmentAmount } = req.body;

    // Get portfolio details
    const portfolio = await Portfolio.findByPk(portfolioId);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Investment plan not found'
      });
    }

    // Validate investment amount
    const amount = parseFloat(investmentAmount);
    const minInvestment = parseFloat(portfolio.minInvestment);
    const maxInvestment = parseFloat(portfolio.maxInvestment);

    if (amount < minInvestment || amount > maxInvestment) {
      return res.status(400).json({
        success: false,
        message: `Investment amount must be between $${minInvestment.toLocaleString()} and $${maxInvestment.toLocaleString()}`
      });
    }

    // Check availability
    if (portfolio.availableSlots !== -1 && portfolio.usedSlots >= portfolio.availableSlots) {
      return res.status(400).json({
        success: false,
        message: 'This investment plan is fully subscribed'
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Transaction.findOne({
      where: {
        userId: req.user.id,
        type: 'deposit',
        category: 'investment',
        status: { [Op.in]: ['pending', 'completed'] }
      }
    });

    if (existingSubscription && existingSubscription.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You already have an active investment subscription'
      });
    }

    if (existingSubscription && existingSubscription.status === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'You have a pending investment deposit. Please complete or cancel it first.'
      });
    }

    // Generate unique transaction ID
    const transactionId = 'DEP_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // Get active admin wallets from AdminWallet table
    const activeWallets = await AdminWallet.findAll({
      where: { isActive: true },
      attributes: [
        'walletType',
        'walletAddress',
        'qrCodeImage',
        'networkType'
      ],
      order: [['walletType', 'ASC']]
    });

    // Build wallet addresses object
    const walletAddresses = {};
    const qrCodes = {};
    const availablePaymentMethods = [];

    // Default wallet addresses as fallback
    const defaultWallets = {
      'BTC': '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      'USDT': 'TQn9Y2khEsLJW1ChVWFMSMeRDow5oREqwm',
      'ETH': '0x742d35Cc69B24E5e5b25E5b8F12B7a09F8d6b8c4',
      'BNB': 'bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64k'
    };

    if (activeWallets.length > 0) {
      // Use admin-configured wallets
      activeWallets.forEach(wallet => {
        walletAddresses[wallet.walletType] = wallet.walletAddress;
        availablePaymentMethods.push(wallet.walletType);
        
        // Only use uploaded QR codes from admin panel
        if (wallet.qrCodeImage) {
          qrCodes[wallet.walletType] = wallet.qrCodeImage;
        }
      });
    } else {
      // Fallback to default wallets if no admin wallets configured
      Object.entries(defaultWallets).forEach(([currency, address]) => {
        walletAddresses[currency] = address;
        availablePaymentMethods.push(currency);
        // No QR codes for default wallets - admin must upload them
      });
    }

    // Only use QR codes that were uploaded in admin panel
    // No dynamic QR code generation to avoid API hanging

    // Calculate fees and totals
    const subscriptionFee = portfolio.requiresSubscription ? parseFloat(portfolio.subscriptionFee) : 0;
    const platformFee = amount * 0.02; // 2% platform fee
    const totalAmount = amount + subscriptionFee + platformFee;

    // Create pending transaction
    const depositInfo = {
      portfolioId: portfolio.id,
      portfolioName: portfolio.name,
      investmentAmount: amount,
      subscriptionFee: subscriptionFee,
      platformFee: platformFee,
      totalAmount: totalAmount,
      walletAddresses: walletAddresses,
        qrCodes: qrCodes,
        paymentMethods: availablePaymentMethods,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const transaction = await Transaction.create({
      transactionId: transactionId,
      userId: req.user.id,
      type: 'deposit',
      category: 'investment',
      amount: totalAmount,
      currency: 'USD',
      status: 'pending',
      description: `Investment deposit for ${portfolio.name}`,
      depositInfo: depositInfo,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      balanceBefore: parseFloat(req.user.walletBalance),
      balanceAfter: parseFloat(req.user.walletBalance), // Will be updated after approval
      initiatedAt: new Date()
    });

    logger.logUserAction(req.user.id, 'DEPOSIT_INITIALIZED', {
      transactionId: transaction.transactionId,
      portfolioId: portfolio.id,
      amount: totalAmount
    });

    res.status(200).json({
      success: true,
      message: 'Deposit initialized successfully',
      data: {
        transactionId: transaction.transactionId,
        portfolioId: portfolio.id,
        portfolioName: portfolio.name,
        investmentAmount: amount,
        subscriptionFee: subscriptionFee,
        platformFee: platformFee,
        totalAmount: totalAmount,
        walletAddresses: walletAddresses,
        qrCodes: qrCodes,
        paymentMethods: availablePaymentMethods,
        expiresAt: depositInfo.expiresAt,
        instructions: [
          'Choose your preferred cryptocurrency payment method',
          'Send the exact amount to the provided wallet address',
          'Upload your payment proof (screenshot/transaction hash)',
          'Wait for admin approval (usually within 24 hours)',
          'Your investment will be activated after approval'
        ]
      }
    });

  } catch (error) {
    logger.logError('INITIALIZE_DEPOSIT_ERROR', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing deposit',
      error: error.message
    });
  }
});

// @desc    Upload payment proof for deposit
// @route   POST /api/deposit/proof
// @access  Private
const uploadPaymentProof = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('=== PAYMENT PROOF SUBMISSION DEBUG START ===');
    console.log('Request timestamp:', new Date().toISOString());
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    } : 'NO FILE');
    console.log('Request headers content-type:', req.headers['content-type']);
    console.log('Request headers content-length:', req.headers['content-length']);
    console.log('User ID:', req.user?.id);
    
    const { transactionId, paymentMethod, transactionHash, notes, imagePath } = req.body;
    const proofImageFile = req.file;

    console.log('Extracted data:', {
      transactionId,
      paymentMethod,
      transactionHash,
      notes,
      imagePath,
      hasFile: !!proofImageFile
    });

    // Check if we have either uploaded file (old method) or image path (new method)
    if (!proofImageFile && !imagePath) {
      console.log('ERROR: No proof image file or image path provided');
      return res.status(400).json({
        success: false,
        message: 'Payment proof image is required.'
      });
    }

    // Find the transaction
    console.log('Searching for transaction with:', {
      transactionId,
      userId: req.user.id,
      type: 'deposit',
      status: 'pending'
    });
    
    const transaction = await Transaction.findOne({
      where: {
        transactionId: transactionId,
        userId: req.user.id,
        type: 'deposit',
        status: 'pending'
      }
    });

    console.log('Found transaction:', transaction ? {
      id: transaction.id,
      transactionId: transaction.transactionId,
      status: transaction.status,
      amount: transaction.amount
    } : 'NOT FOUND');

    if (!transaction) {
      console.log('ERROR: Transaction not found');
      return res.status(404).json({
        success: false,
        message: 'Deposit transaction not found or already processed'
      });
    }

    // Check if deposit has expired
    const depositInfo = transaction.depositInfo;
    if (new Date() > new Date(depositInfo.expiresAt)) {
      await transaction.update({ status: 'expired' });
      return res.status(400).json({
        success: false,
        message: 'Deposit has expired. Please create a new deposit.'
      });
    }

    // Generate file URL for database storage
    let proofImageUrl;
    let proofImageFileName;
    
    if (proofImageFile) {
      // Old method: file was uploaded in this request
      proofImageUrl = `/uploads/payment-proofs/${proofImageFile.filename}`;
      proofImageFileName = proofImageFile.filename;
      console.log('Using uploaded file:', proofImageFile.filename);
    } else if (imagePath) {
      // New method: file was uploaded separately and we have the path
      proofImageUrl = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      proofImageFileName = path.basename(imagePath);
      console.log('Using pre-uploaded image path:', imagePath);
    }

    // Update deposit info with payment proof
    const updatedDepositInfo = {
      ...depositInfo,
      paymentProof: {
        method: paymentMethod,
        transactionHash: transactionHash,
        proofImage: proofImageUrl,
        proofImageFileName: proofImageFileName,
        notes: notes,
        uploadedAt: new Date()
      }
    };

    // Update transaction with proof details
    console.log('Updating transaction with proof image:', proofImageFileName);
    console.log('Full proof image URL:', proofImageUrl);
    console.log('Updated deposit info:', JSON.stringify(updatedDepositInfo, null, 2));
    
    const updateData = {
      depositInfo: updatedDepositInfo,
      status: 'pending',
      paymentMethod: paymentMethod,
      transactionHash: transactionHash || null,
      proofImage: proofImageUrl, // Store file path instead of Base64
      notes: `Payment proof uploaded via ${paymentMethod}` + (notes ? `. Notes: ${notes}` : '')
    };
    
    console.log('About to update transaction with data:', JSON.stringify(updateData, null, 2));
    
    await transaction.update(updateData);
    
    console.log('Transaction updated successfully with file:', proofImageUrl);

    logger.logUserAction(req.user.id, 'PAYMENT_PROOF_UPLOADED', {
      transactionId: transaction.transactionId,
      paymentMethod: paymentMethod,
      transactionHash: transactionHash
    });

    const totalTime = Date.now() - startTime;
    console.log(`SUCCESS: Payment proof upload completed in ${totalTime}ms`);
    console.log('=== PAYMENT PROOF UPLOAD DEBUG END ===');
    
    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      processingTime: `${totalTime}ms`,
      data: {
        transactionId: transaction.transactionId,
        status: 'pending',
        message: 'Your payment proof has been submitted for review. You will be notified once it\'s approved.'
      }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.log('=== PAYMENT PROOF UPLOAD ERROR ===');
    console.error(`Error occurred after ${totalTime}ms processing time`);
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    console.log('=== PAYMENT PROOF UPLOAD ERROR END ===');
    
    logger.logError('UPLOAD_PAYMENT_PROOF_ERROR', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading payment proof',
      error: error.message,
      processingTime: `${totalTime}ms`,
      debug: {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// @desc    Get user's deposit history
// @route   GET /api/deposit/history
// @access  Private
const getDepositHistory = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = { 
      userId: req.user.id,
      type: 'deposit'
    };
    if (status) whereConditions.status = status;

    const deposits = await Transaction.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id', 'transactionId', 'amount', 'currency', 'status',
        'description', 'depositInfo', 'created_at', 'completedAt',
        'notes'
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: deposits.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(deposits.count / limit),
        totalDeposits: deposits.count,
        hasMore: offset + deposits.rows.length < deposits.count
      }
    });

  } catch (error) {
    logger.logError('GET_DEPOSIT_HISTORY_ERROR', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deposit history',
      error: error.message
    });
  }
});

// @desc    Cancel pending deposit
// @route   POST /api/deposit/cancel
// @access  Private
const cancelDeposit = asyncHandler(async (req, res) => {
  try {
    const { transactionId } = req.body;

    const transaction = await Transaction.findOne({
      where: {
        transactionId: transactionId,
        userId: req.user.id,
        type: 'deposit',
        status: { [Op.in]: ['pending', 'proof_submitted'] }
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Deposit transaction not found or cannot be cancelled'
      });
    }

    await transaction.update({
      status: 'cancelled',
      notes: (transaction.notes || '') + ' | Cancelled by user'
    });

    logger.logUserAction(req.user.id, 'DEPOSIT_CANCELLED', {
      transactionId: transaction.transactionId
    });

    res.status(200).json({
      success: true,
      message: 'Deposit cancelled successfully'
    });

  } catch (error) {
    logger.logError('CANCEL_DEPOSIT_ERROR', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling deposit',
      error: error.message
    });
  }
});

// @desc    Upload payment proof image immediately when selected
// @route   POST /api/deposit/upload-proof
// @access  Private
const uploadProofImageImmediate = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('=== IMMEDIATE IMAGE UPLOAD START ===', {
      userId: req.user.id,
      userEmail: req.user.email,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });

    // Check if file was uploaded
    if (!req.file) {
      logger.error('No file uploaded in request', {
        userId: req.user.id,
        body: req.body,
        files: req.files
      });
      return res.status(400).json({
        success: false,
        message: 'No payment proof image uploaded'
      });
    }

    const uploadedFile = req.file;
    logger.info('File upload details:', {
      userId: req.user.id,
      originalName: uploadedFile.originalname,
      filename: uploadedFile.filename,
      mimetype: uploadedFile.mimetype,
      size: uploadedFile.size,
      destination: uploadedFile.destination,
      path: uploadedFile.path
    });

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
      // Delete the invalid file
      const fs = require('fs');
      try {
        if (fs.existsSync(uploadedFile.path)) {
          fs.unlinkSync(uploadedFile.path);
        }
      } catch (deleteError) {
        logger.error('Error deleting invalid file:', deleteError);
      }
      
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG and PNG images are allowed.'
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (uploadedFile.size > maxSize) {
      // Delete the oversized file
      const fs = require('fs');
      try {
        if (fs.existsSync(uploadedFile.path)) {
          fs.unlinkSync(uploadedFile.path);
        }
      } catch (deleteError) {
        logger.error('Error deleting oversized file:', deleteError);
      }
      
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum allowed size is 5MB. Your file is ${(uploadedFile.size / 1024 / 1024).toFixed(2)}MB.`
      });
    }

    // Generate relative path for database storage
    const relativePath = path.relative(process.cwd(), uploadedFile.path);
    
    const processingTime = Date.now() - startTime;
    logger.info('Image upload completed successfully', {
      userId: req.user.id,
      filename: uploadedFile.filename,
      relativePath: relativePath,
      processingTime: `${processingTime}ms`
    });

    logger.info('=== IMMEDIATE IMAGE UPLOAD END ===', {
      userId: req.user.id,
      success: true,
      processingTime: `${processingTime}ms`
    });

    // Return success with image path
    return res.status(200).json({
      success: true,
      message: 'Payment proof image uploaded successfully',
      data: {
        imagePath: relativePath,
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalname,
        size: uploadedFile.size,
        uploadTime: new Date().toISOString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('Error in immediate image upload:', {
      userId: req.user?.id,
      error: error.message,
      stack: error.stack,
      processingTime: `${processingTime}ms`
    });

    // Clean up file if it exists
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          logger.info('Cleaned up file after error:', req.file.path);
        }
      } catch (deleteError) {
        logger.error('Error deleting file after upload error:', deleteError);
      }
    }

    logger.info('=== IMMEDIATE IMAGE UPLOAD END (ERROR) ===', {
      userId: req.user?.id,
      success: false,
      error: error.message,
      processingTime: `${processingTime}ms`
    });

    return res.status(500).json({
      success: false,
      message: 'Failed to upload payment proof image. Please try again.'
    });
  }
});

// Register routes
router.get('/payment-methods', protect, getPaymentMethods);
router.post('/upload-proof', protect, uploadProofImage, uploadProofImageImmediate);
router.post('/initialize', protect, [
  body('portfolioId').isInt().withMessage('Valid portfolio ID is required'),
  body('investmentAmount').isFloat({ min: 1 }).withMessage('Valid investment amount is required')
], validationError, initializeDeposit);

router.post('/proof', protect, (req, res, next) => {
  console.log('=== ROUTE /proof HIT ===');
  console.log('Request method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  console.log('Request body (before multer):', req.body);
  console.log('Request files (before multer):', req.files);
  console.log('Request file (before multer):', req.file);
  next();
}, (req, res, next) => {
  // Only apply multer if Content-Type suggests file upload
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    // Apply multer for file upload (old method)
    uploadProofImage(req, res, next);
  } else {
    // Skip multer for JSON requests (new method with image path)
    next();
  }
}, (req, res, next) => {
  console.log('=== AFTER CONDITIONAL MULTER MIDDLEWARE ===');
  console.log('Request body (after multer):', req.body);
  console.log('Request file (after multer):', req.file ? {
    originalname: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: req.file.path
  } : 'NO FILE');
  next();
}, [
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('paymentMethod').custom(async (value) => {
    console.log('=== PAYMENT METHOD VALIDATION ===');
    console.log('Received payment method:', value);
    console.log('Uppercase version:', value?.toUpperCase());
    
    // Validate payment method against active admin wallets
    const activeWallet = await AdminWallet.findOne({
      where: { 
        walletType: value.toUpperCase(),
        isActive: true 
      }
    });
    
    console.log('Found active wallet:', activeWallet ? {
      id: activeWallet.id,
      walletType: activeWallet.walletType,
      isActive: activeWallet.isActive
    } : 'NOT FOUND');
    
    if (!activeWallet) {
      // Let's also check what wallets are available
      const allWallets = await AdminWallet.findAll({
        where: { isActive: true },
        attributes: ['id', 'walletType', 'isActive']
      });
      console.log('Available active wallets:', allWallets);
      throw new Error('Invalid or inactive payment method');
    }
    return true;
  }),
  body('imagePath').optional().trim().notEmpty().withMessage('Image path cannot be empty if provided'),
  body('transactionHash').optional().trim(),
  body('notes').optional().trim().isLength({ max: 500 })
], validationError, uploadPaymentProof);

// Payment submission function disabled as requested
// @desc    Submit complete payment (simplified single endpoint) - DISABLED
// @route   POST /api/deposit/submit-payment - DISABLED
// @access  Private - DISABLED
/* const submitCompletePayment = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('🚀 === COMPLETE PAYMENT SUBMISSION START ===');
    console.log('Request timestamp:', new Date().toISOString());
    console.log('Request body:', req.body);
    console.log('User ID:', req.user?.id);
    
    const { portfolioId, investmentAmount, paymentMethod, imagePath, notes } = req.body;

    // Validate required fields
    if (!portfolioId || !investmentAmount || !paymentMethod || !imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: portfolioId, investmentAmount, paymentMethod, and imagePath are required'
      });
    }

    // Validate portfolio exists
    const portfolio = await Portfolio.findByPk(portfolioId);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Validate payment method
    const activeWallet = await AdminWallet.findOne({
      where: { 
        walletType: paymentMethod.toUpperCase(),
        isActive: true 
      }
    });
    
    if (!activeWallet) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or inactive payment method'
      });
    }

    // Validate image path exists
    const fs = require('fs');
    const fullImagePath = path.join(__dirname, '..', imagePath.startsWith('/') ? imagePath.substring(1) : imagePath);
    if (!fs.existsSync(fullImagePath)) {
      return res.status(400).json({
        success: false,
        message: 'Payment proof image not found. Please re-upload your image.'
      });
    }

    // Generate unique transaction ID
    const transactionId = `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get user's current balance
    const user = await User.findByPk(req.user.id);
    const currentBalance = parseFloat(user.walletBalance) || 0;

    // Calculate fees
    const amount = parseFloat(investmentAmount);
    const subscriptionFee = portfolio.requiresSubscription ? parseFloat(portfolio.subscriptionFee) || 0 : 0;
    const platformFee = 0; // No platform fee for now
    const totalAmount = amount + subscriptionFee + platformFee;

    // Create deposit info
    const depositInfo = {
      portfolioId: portfolioId,
      portfolioName: portfolio.name,
      investmentAmount: amount,
      subscriptionFee: subscriptionFee,
      platformFee: platformFee,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      adminWallet: {
        walletType: activeWallet.walletType,
        walletAddress: activeWallet.walletAddress,
        networkType: activeWallet.networkType
      },
      paymentProof: {
        method: paymentMethod,
        proofImage: imagePath,
        proofImageFileName: path.basename(imagePath),
        notes: notes,
        uploadedAt: new Date()
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      status: 'pending'
    };

    // Create transaction record
    const transaction = await Transaction.create({
      transactionId: transactionId,
      userId: req.user.id,
      type: 'deposit',
      category: 'manual',
      amount: totalAmount,
      currency: 'USD',
      status: 'pending',
      depositInfo: depositInfo,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance, // No balance change until approved
      portfolioId: portfolioId,
      investmentAmount: amount,
      subscriptionFee: subscriptionFee,
      platformFee: platformFee,
      paymentMethod: paymentMethod,
      proofImage: imagePath,
      notes: notes || 'Payment submitted via dashboard',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      initiatedAt: new Date()
    });

    console.log('✅ Transaction created successfully:', {
      id: transaction.id,
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      status: transaction.status
    });

    // Log user action
    logger.logUserAction(req.user.id, 'PAYMENT_SUBMITTED', {
      transactionId: transaction.transactionId,
      portfolioId: portfolioId,
      amount: totalAmount,
      paymentMethod: paymentMethod
    });

    const totalTime = Date.now() - startTime;
    console.log(`🎉 Payment submission completed in ${totalTime}ms`);
    console.log('=== COMPLETE PAYMENT SUBMISSION END ===');
    
    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully! Your transaction is pending approval.',
      processingTime: `${totalTime}ms`,
      data: {
        transactionId: transaction.transactionId,
        amount: totalAmount,
        portfolioName: portfolio.name,
        status: 'pending',
        message: 'Your payment has been submitted for review. You will be notified once it\'s approved.'
      }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('❌ Payment submission error:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.log(`❌ Failed after ${totalTime}ms`);
    
    logger.logError('SUBMIT_PAYMENT_ERROR', error, {
      userId: req.user?.id,
      body: req.body
    });

    res.status(500).json({
      success: false,
      message: 'Payment submission failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}); */



router.get('/history', protect, getDepositHistory);
router.post('/cancel', protect, [
  body('transactionId').notEmpty().withMessage('Transaction ID is required')
], validationError, cancelDeposit);

module.exports = router;