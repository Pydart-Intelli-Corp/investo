const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { User, Portfolio, Transaction, Affiliate } = require('../models');
const { 
  asyncHandler, 
  validationError, 
  notFoundError,
  authError 
} = require('../middleware/errorHandler');
const { protect, adminOnly, superAdminOnly } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(adminOnly);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await Promise.all([
    // User statistics
    User.count(),
    User.count({ where: { isActive: true } }),
    User.count({ where: { created_at: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    
    // Transaction statistics
    Transaction.count(),
    Transaction.count({ where: { status: 'pending' } }),
    Transaction.sum('amount', { where: { type: 'deposit', status: 'completed' } }) || 0,
    Transaction.sum('amount', { where: { type: 'withdrawal', status: 'completed' } }) || 0,
    
    // Portfolio statistics
    Portfolio.count({ where: { isActive: true } }),
    
    // Recent transactions
    Transaction.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }]
    }),
    
    // Pending deposits
    Transaction.count({ where: { type: 'deposit', status: 'pending' } }),
    
    // Pending withdrawals
    Transaction.count({ where: { type: 'withdrawal', status: 'pending' } })
  ]);

  logger.logAdminAction(req.user.id, 'DASHBOARD_VIEW', null);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: stats[0],
        active: stats[1],
        newToday: stats[2]
      },
      transactions: {
        total: stats[3],
        pending: stats[4],
        totalDeposits: parseFloat(stats[5]) || 0,
        totalWithdrawals: parseFloat(stats[6]) || 0
      },
      portfolios: {
        active: stats[7]
      },
      recentTransactions: stats[8],
      pendingApprovals: {
        deposits: stats[9],
        withdrawals: stats[10]
      }
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const rank = req.query.rank || '';
  const status = req.query.status || '';

  const offset = (page - 1) * limit;
  const where = {};

  // Add search filter
  if (search) {
    where[Op.or] = [
      { email: { [Op.like]: `%${search}%` } },
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      { referralCode: { [Op.like]: `%${search}%` } }
    ];
  }

  // Add rank filter
  if (rank) {
    where.currentRank = rank;
  }

  // Add status filter
  if (status === 'active') {
    where.isActive = true;
  } else if (status === 'inactive') {
    where.isActive = false;
  }

  const { count, rows: users } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    attributes: { exclude: ['password'] },
    include: [
      {
        model: User,
        as: 'referrer',
        attributes: ['id', 'email', 'firstName', 'lastName', 'referralCode']
      },
      {
        model: Portfolio,
        as: 'subscription',
        attributes: ['id', 'name', 'type', 'dailyROI']
      }
    ]
  });

  logger.logAdminAction(req.user.id, 'USERS_VIEW', null, { page, limit, search, rank, status });

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: User,
        as: 'referrer',
        attributes: ['id', 'email', 'firstName', 'lastName', 'referralCode']
      },
      {
        model: User,
        as: 'referrals',
        attributes: ['id', 'email', 'firstName', 'lastName', 'created_at', 'totalDeposited']
      },
      {
        model: Portfolio,
        as: 'subscription',
        attributes: ['id', 'name', 'type', 'dailyROI', 'price']
      },
      {
        model: Transaction,
        as: 'transactions',
        limit: 10,
        order: [['created_at', 'DESC']]
      }
    ]
  });

  if (!user) {
    return next(notFoundError('User not found'));
  }

  logger.logAdminAction(req.user.id, 'USER_DETAILS_VIEW', user.id);

  res.status(200).json({
    success: true,
    data: { user },
    timestamp: new Date().toISOString()
  });
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(notFoundError('User not found'));
  }

  user.isActive = isActive;
  await user.save();

  logger.logAdminAction(req.user.id, 'USER_STATUS_UPDATE', user.id, { 
    newStatus: isActive ? 'active' : 'inactive' 
  });

  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: { user: { id: user.id, email: user.email, isActive: user.isActive } },
    timestamp: new Date().toISOString()
  });
});

// @desc    Update user rank
// @route   PUT /api/admin/users/:id/rank
// @access  Private/Admin
const updateUserRank = asyncHandler(async (req, res) => {
  const { rank } = req.body;
  const validRanks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  
  if (!validRanks.includes(rank)) {
    return next(validationError('Invalid rank specified'));
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(notFoundError('User not found'));
  }

  const oldRank = user.currentRank;
  user.currentRank = rank;
  user.rankUpdatedAt = new Date();
  await user.save();

  logger.logAdminAction(req.user.id, 'USER_RANK_UPDATE', user.id, { 
    oldRank, 
    newRank: rank 
  });

  res.status(200).json({
    success: true,
    message: `User rank updated to ${rank}`,
    data: { 
      user: { 
        id: user.id, 
        email: user.email, 
        currentRank: user.currentRank,
        rankUpdatedAt: user.rankUpdatedAt 
      } 
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Get pending deposits
// @route   GET /api/admin/deposits/pending
// @access  Private/Admin
const getPendingDeposits = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: deposits } = await Transaction.findAndCountAll({
    where: {
      type: 'deposit',
      status: 'pending'
    },
    limit,
    offset,
    order: [['created_at', 'ASC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'walletAddress', 'phoneNumber']
      }
    ]
  });

  logger.logAdminAction(req.user.id, 'PENDING_DEPOSITS_VIEW', null, { page, limit });

  res.status(200).json({
    success: true,
    data: {
      deposits,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Approve deposit
// @route   PUT /api/admin/deposits/:id/approve
// @access  Private/Admin
const approveDeposit = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  
  const deposit = await Transaction.findOne({
    where: {
      id: req.params.id,
      type: 'deposit',
      status: 'pending'
    },
    include: [{ model: User, as: 'user' }]
  });

  if (!deposit) {
    return next(notFoundError('Pending deposit not found'));
  }

  const user = deposit.user;
  const depositAmount = parseFloat(deposit.amount);

  // Start transaction
  const t = await sequelize.transaction();

  try {
    // Approve deposit
    await deposit.approve(req.user.id, notes);

    // Update user balance and totals
    user.walletBalance = parseFloat(user.walletBalance) + depositAmount;
    user.totalDeposited = parseFloat(user.totalDeposited) + depositAmount;
    user.balanceAfter = user.walletBalance;
    
    // Update rank based on new deposit total
    const rankChanged = user.updateRank();
    await user.save({ transaction: t });

    // Activate subscription if deposit info contains portfolio
    if (deposit.depositInfo && deposit.depositInfo.portfolio) {
      const portfolio = await Portfolio.findByPk(deposit.depositInfo.portfolio);
      if (portfolio) {
        user.activeSubscription = portfolio.id;
        user.subscriptionStatus = 'active';
        user.subscriptionStartDate = new Date();
        
        // Calculate end date based on portfolio duration
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + portfolio.getDurationInDays());
        user.subscriptionEndDate = endDate;
        
        // Set daily ROI
        user.dailyROI = portfolio.dailyROI;
        
        // Activate bot
        user.botActive = true;
        user.botActivatedAt = new Date();
        
        await user.save({ transaction: t });
        
        // Update portfolio statistics
        portfolio.totalSubscribers += 1;
        portfolio.activeSubscribers += 1;
        portfolio.totalVolume = parseFloat(portfolio.totalVolume) + depositAmount;
        await portfolio.save({ transaction: t });
      }
    }

    // Distribute commissions to referral chain
    if (user.referredBy) {
      await distributeCommissions(user.referredBy, depositAmount, 1, t);
    }

    await t.commit();

    logger.logAdminAction(req.user.id, 'DEPOSIT_APPROVED', user.id, {
      transactionId: deposit.transactionId,
      amount: depositAmount,
      notes
    });

    res.status(200).json({
      success: true,
      message: 'Deposit approved successfully',
      data: {
        transaction: {
          id: deposit.id,
          transactionId: deposit.transactionId,
          status: deposit.status,
          approvedBy: deposit.approvedBy,
          approvedAt: deposit.approvedAt
        },
        user: {
          id: user.id,
          walletBalance: user.walletBalance,
          totalDeposited: user.totalDeposited,
          currentRank: user.currentRank,
          rankChanged
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    await t.rollback();
    throw error;
  }
});

// Helper function to distribute commissions
const distributeCommissions = async (referrerId, amount, level, transaction) => {
  if (level > 15) return; // Max 15 levels

  const referrer = await User.findByPk(referrerId, { transaction });
  if (!referrer || !referrer.isActive) return;

  // Get commission rate for this level
  const commissionRates = {
    1: 5.0, 2: 2.0, 3: 2.0, 4: 2.0, 5: 2.0,
    6: 1.0, 7: 1.0, 8: 1.0, 9: 1.0, 10: 1.0,
    11: 0.5, 12: 0.5, 13: 0.5, 14: 0.5, 15: 0.5
  };

  const rate = commissionRates[level] || 0;
  const commissionAmount = (amount * rate) / 100;

  if (commissionAmount > 0) {
    // Create commission transaction
    await Transaction.create({
      userId: referrer.id,
      type: 'commission',
      category: 'automatic',
      amount: commissionAmount,
      currency: 'USD',
      status: 'completed',
      balanceBefore: referrer.walletBalance,
      balanceAfter: parseFloat(referrer.walletBalance) + commissionAmount,
      referralInfo: {
        level,
        percentage: rate,
        originalAmount: amount,
        referralType: 'deposit'
      },
      description: `Level ${level} referral commission`,
      completedAt: new Date()
    }, { transaction });

    // Update referrer balance
    referrer.walletBalance = parseFloat(referrer.walletBalance) + commissionAmount;
    referrer.totalCommissions = parseFloat(referrer.totalCommissions) + commissionAmount;
    await referrer.save({ transaction });

    // Update affiliate record
    const affiliate = await Affiliate.findOne({ where: { userId: referrer.id } });
    if (affiliate) {
      await affiliate.addCommission(commissionAmount, level);
    }

    // Continue to next level
    if (referrer.referredBy) {
      await distributeCommissions(referrer.referredBy, amount, level + 1, transaction);
    }
  }
};

// @desc    Reject deposit
// @route   PUT /api/admin/deposits/:id/reject
// @access  Private/Admin
const rejectDeposit = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const deposit = await Transaction.findOne({
    where: {
      id: req.params.id,
      type: 'deposit',
      status: 'pending'
    },
    include: [{ model: User, as: 'user' }]
  });

  if (!deposit) {
    return next(notFoundError('Pending deposit not found'));
  }

  await deposit.reject(req.user.id, reason);

  logger.logAdminAction(req.user.id, 'DEPOSIT_REJECTED', deposit.user.id, {
    transactionId: deposit.transactionId,
    amount: deposit.amount,
    reason
  });

  res.status(200).json({
    success: true,
    message: 'Deposit rejected',
    data: {
      transaction: {
        id: deposit.id,
        transactionId: deposit.transactionId,
        status: deposit.status,
        approvedBy: deposit.approvedBy,
        approvedAt: deposit.approvedAt,
        internalNotes: deposit.internalNotes
      }
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Get pending withdrawals
// @route   GET /api/admin/withdrawals/pending
// @access  Private/Admin
const getPendingWithdrawals = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows: withdrawals } = await Transaction.findAndCountAll({
    where: {
      type: 'withdrawal',
      status: 'pending'
    },
    limit,
    offset,
    order: [['created_at', 'ASC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'walletAddress', 'phoneNumber', 'walletBalance']
      }
    ]
  });

  logger.logAdminAction(req.user.id, 'PENDING_WITHDRAWALS_VIEW', null, { page, limit });

  res.status(200).json({
    success: true,
    data: {
      withdrawals,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Approve withdrawal
// @route   PUT /api/admin/withdrawals/:id/approve
// @access  Private/Admin
const approveWithdrawal = asyncHandler(async (req, res) => {
  const { notes, transactionHash } = req.body;
  
  const withdrawal = await Transaction.findOne({
    where: {
      id: req.params.id,
      type: 'withdrawal',
      status: 'pending'
    },
    include: [{ model: User, as: 'user' }]
  });

  if (!withdrawal) {
    return next(notFoundError('Pending withdrawal not found'));
  }

  const user = withdrawal.user;
  const withdrawalAmount = parseFloat(withdrawal.amount);

  // Check if user has sufficient balance
  if (parseFloat(user.walletBalance) < withdrawalAmount) {
    return next(validationError('User has insufficient balance'));
  }

  // Start transaction
  const t = await sequelize.transaction();

  try {
    // Approve withdrawal
    await withdrawal.approve(req.user.id, notes);

    // Update withdrawal info with transaction hash
    if (transactionHash) {
      withdrawal.withdrawalInfo = {
        ...withdrawal.withdrawalInfo,
        transactionHash,
        processedAt: new Date()
      };
      await withdrawal.save({ transaction: t });
    }

    // Update user balance
    user.walletBalance = parseFloat(user.walletBalance) - withdrawalAmount;
    user.totalWithdrawn = parseFloat(user.totalWithdrawn) + withdrawalAmount;
    withdrawal.balanceAfter = user.walletBalance;
    await user.save({ transaction: t });

    await t.commit();

    logger.logAdminAction(req.user.id, 'WITHDRAWAL_APPROVED', user.id, {
      transactionId: withdrawal.transactionId,
      amount: withdrawalAmount,
      transactionHash,
      notes
    });

    res.status(200).json({
      success: true,
      message: 'Withdrawal approved successfully',
      data: {
        transaction: {
          id: withdrawal.id,
          transactionId: withdrawal.transactionId,
          status: withdrawal.status,
          approvedBy: withdrawal.approvedBy,
          approvedAt: withdrawal.approvedAt
        },
        user: {
          id: user.id,
          walletBalance: user.walletBalance,
          totalWithdrawn: user.totalWithdrawn
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    await t.rollback();
    throw error;
  }
});

// @desc    Reject withdrawal
// @route   PUT /api/admin/withdrawals/:id/reject
// @access  Private/Admin
const rejectWithdrawal = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const withdrawal = await Transaction.findOne({
    where: {
      id: req.params.id,
      type: 'withdrawal',
      status: 'pending'
    },
    include: [{ model: User, as: 'user' }]
  });

  if (!withdrawal) {
    return next(notFoundError('Pending withdrawal not found'));
  }

  await withdrawal.reject(req.user.id, reason);

  logger.logAdminAction(req.user.id, 'WITHDRAWAL_REJECTED', withdrawal.user.id, {
    transactionId: withdrawal.transactionId,
    amount: withdrawal.amount,
    reason
  });

  res.status(200).json({
    success: true,
    message: 'Withdrawal rejected',
    data: {
      transaction: {
        id: withdrawal.id,
        transactionId: withdrawal.transactionId,
        status: withdrawal.status,
        approvedBy: withdrawal.approvedBy,
        approvedAt: withdrawal.approvedAt,
        internalNotes: withdrawal.internalNotes
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Apply routes
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/rank', updateUserRank);
router.get('/deposits/pending', getPendingDeposits);
router.put('/deposits/:id/approve', approveDeposit);
router.put('/deposits/:id/reject', rejectDeposit);
router.get('/withdrawals/pending', getPendingWithdrawals);
router.put('/withdrawals/:id/approve', approveWithdrawal);
router.put('/withdrawals/:id/reject', rejectWithdrawal);

// @desc    Get referral links and statistics
// @route   GET /api/admin/referrals
// @access  Private/Admin
const getReferralStats = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Build search condition
    const searchCondition = search ? {
      [Op.or]: [
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { referralCode: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // Get users with referral statistics
    const users = await User.findAndCountAll({
      where: {
        ...searchCondition,
        isActive: true
      },
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'referralCode', 
        'totalReferrals', 'directReferrals', 'totalCommissions',
        'currentRank', 'created_at'
      ],
      include: [
        {
          model: User,
          as: 'referrals',
          attributes: ['id', 'email', 'firstName', 'lastName', 'created_at'],
          limit: 5,
          order: [['created_at', 'DESC']]
        }
      ],
      order: [['totalReferrals', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    // Get overall referral statistics
    const overallStats = await Promise.all([
      User.count(),
      User.sum('totalReferrals') || 0,
      User.sum('totalCommissions') || 0,
      User.count({ where: { totalReferrals: { [Op.gt]: 0 } } })
    ]);

    const statsObject = {
      totalUsers: overallStats[0],
      totalReferrals: overallStats[1],
      totalCommissions: overallStats[2],
      activeReferrers: overallStats[3]
    };

    res.status(200).json({
      success: true,
      data: {
        users: users.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(users.count / limit),
          totalUsers: users.count,
          hasMore: offset + users.rows.length < users.count
        },
        stats: statsObject
      }
    });

  } catch (error) {
    logger.logError('GET_REFERRAL_STATS_ERROR', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching referral statistics',
      error: error.message 
    });
  }
});

// @desc    Generate new referral link for admin distribution
// @route   POST /api/admin/referrals/generate
// @access  Private/Admin
const generateReferralLink = asyncHandler(async (req, res) => {
  try {
    const { email, firstName, lastName, customCode } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate unique referral code
    let referralCode;
    if (customCode) {
      // Check if custom code is available
      const existingCode = await User.findOne({ where: { referralCode: customCode.toUpperCase() } });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'This referral code is already taken'
        });
      }
      referralCode = customCode.toUpperCase();
    } else {
      // Generate automatic code
      do {
        referralCode = `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      } while (await User.findOne({ where: { referralCode } }));
    }

    // Create placeholder user for referral link
    const tempUser = await User.create({
      email,
      password: Math.random().toString(36).substr(2, 12), // Temporary password
      firstName: firstName || 'New',
      lastName: lastName || 'User',
      referralCode,
      isActive: false,
      isEmailVerified: false,
      role: 'user'
    });

    // Generate referral link
    const referralLink = `${process.env.FRONTEND_URL}/register?ref=${referralCode}`;

    logger.logUserAction(req.user.id, 'REFERRAL_LINK_GENERATED', {
      generatedFor: email,
      referralCode,
      adminId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Referral link generated successfully',
      data: {
        referralCode,
        referralLink,
        email,
        firstName,
        lastName,
        createdAt: tempUser.createdAt
      }
    });

  } catch (error) {
    logger.logError('GENERATE_REFERRAL_LINK_ERROR', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating referral link',
      error: error.message 
    });
  }
});

// @desc    Get referral tree for a specific user
// @route   GET /api/admin/referrals/tree/:userId
// @access  Private/Admin
const getReferralTree = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { levels = 5 } = req.query;

    // Recursive function to build referral tree
    const buildReferralTree = async (parentId, currentLevel = 1, maxLevels = 5) => {
      if (currentLevel > maxLevels) return [];

      const referrals = await User.findAll({
        where: { referredBy: parentId },
        attributes: [
          'id', 'email', 'firstName', 'lastName', 'referralCode',
          'totalReferrals', 'directReferrals', 'totalCommissions',
          'currentRank', 'created_at', 'isActive'
        ],
        order: [['created_at', 'DESC']]
      });

      const tree = [];
      for (const referral of referrals) {
        const children = await buildReferralTree(referral.id, currentLevel + 1, maxLevels);
        tree.push({
          ...referral.toJSON(),
          level: currentLevel,
          children
        });
      }

      return tree;
    };

    // Get root user details
    const rootUser = await User.findByPk(userId, {
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'referralCode',
        'totalReferrals', 'directReferrals', 'totalCommissions',
        'currentRank', 'created_at', 'isActive'
      ]
    });

    if (!rootUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build the tree
    const referralTree = await buildReferralTree(userId, 1, parseInt(levels));

    res.status(200).json({
      success: true,
      data: {
        rootUser,
        referralTree,
        totalLevels: parseInt(levels)
      }
    });

  } catch (error) {
    logger.logError('GET_REFERRAL_TREE_ERROR', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching referral tree',
      error: error.message 
    });
  }
});

// Register admin referral routes
router.get('/referrals', protect, adminOnly, getReferralStats);
router.post('/referrals/generate', protect, adminOnly, [
  body('email').isEmail().normalizeEmail(),
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('customCode').optional().trim().isLength({ min: 3, max: 20 }).matches(/^[A-Z0-9]+$/)
], validationError, generateReferralLink);
router.get('/referrals/tree/:userId', protect, adminOnly, getReferralTree);

module.exports = router;