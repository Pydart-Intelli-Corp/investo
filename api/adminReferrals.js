const express = require('express');
const router = express.Router();
const { User, Affiliate } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');
const logger = require('../utils/logger');
const crypto = require('crypto');

// Get all users with referral information
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = {};
    if (search && search.trim()) {
      whereClause = {
        [require('sequelize').Op.or]: [
          { email: { [require('sequelize').Op.like]: `%${search.trim()}%` } },
          { firstName: { [require('sequelize').Op.like]: `%${search.trim()}%` } },
          { lastName: { [require('sequelize').Op.like]: `%${search.trim()}%` } },
          { referralCode: { [require('sequelize').Op.like]: `%${search.trim()}%` } }
        ]
      };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'referralCode',
        'totalReferrals', 'directReferrals', 'totalCommissions',
        'currentRank', 'created_at'
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    const totalUsers = await User.count({ where: whereClause });
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    // Get overall statistics
    const stats = {
      totalUsers: await User.count(),
      totalReferrals: await User.sum('totalReferrals') || 0,
      totalCommissions: await User.sum('totalCommissions') || 0,
      activeReferrers: await User.count({
        where: { directReferrals: { [require('sequelize').Op.gt]: 0 } }
      })
    };

    logger.info(`Admin ${req.user.id} viewed referral data`, {
      adminId: req.user.id,
      page,
      limit,
      search,
      usersCount: users.length
    });

    res.json({
      success: true,
      message: 'Referral data retrieved successfully',
      data: {
        users,
        stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount: totalUsers,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching referral data:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id
    });

    res.status(500).json({
      success: false,
      message: 'Error fetching referral data'
    });
  }
});

// Generate new referral link
router.post('/generate', protect, adminOnly, async (req, res) => {
  try {
    const { email, firstName, lastName, customCode } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, first name, and last name are required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate referral code
    let referralCode;
    if (customCode && customCode.trim()) {
      referralCode = customCode.trim().toUpperCase();
      // Check if custom code already exists
      const existingCode = await User.findOne({ where: { referralCode } });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'Referral code already exists'
        });
      }
    } else {
      // Generate random code
      const baseCode = firstName.substring(0, 3).toUpperCase() + 
                      lastName.substring(0, 3).toUpperCase();
      const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
      referralCode = baseCode + randomSuffix;

      // Ensure uniqueness
      let codeExists = await User.findOne({ where: { referralCode } });
      let attempts = 0;
      while (codeExists && attempts < 10) {
        const newSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
        referralCode = baseCode + newSuffix;
        codeExists = await User.findOne({ where: { referralCode } });
        attempts++;
      }
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      referralCode,
      role: 'user',
      isActive: true,
      isEmailVerified: false,
      isProfileComplete: false,
      walletBalance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalEarnings: 0,
      totalCommissions: 0,
      currentRank: 'Bronze',
      subscriptionStatus: 'none',
      botActive: false,
      dailyROI: 0,
      loginAttempts: 0,
      referralLevel: 0,
      totalReferrals: 0,
      directReferrals: 0
    });

    // Create affiliate record
    await Affiliate.create({
      userId: newUser.id,
      referralCode,
      referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/register?ref=${referralCode}`,
      totalReferrals: 0,
      activeReferrals: 0,
      directReferrals: 0,
      levelCounts: {},
      totalCommissions: 0,
      availableCommissions: 0,
      withdrawnCommissions: 0,
      pendingCommissions: 0,
      levelEarnings: {},
      teamStats: {},
      performanceMetrics: {},
      clickStats: {},
      commissionSettings: {},
      achievements: {},
      marketingTools: {},
      isActive: true,
      isPremiumAffiliate: false,
      tier: 'Bronze',
      payoutSettings: {}
    });

    logger.info('New referral link generated', {
      adminId: req.user.id,
      userId: newUser.id,
      email,
      referralCode,
      generatedBy: req.user.email
    });

    res.json({
      success: true,
      message: 'Referral link generated successfully',
      data: {
        userId: newUser.id,
        email,
        referralCode,
        referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/register?ref=${referralCode}`,
        tempPassword,
        firstName,
        lastName
      }
    });

  } catch (error) {
    logger.error('Error generating referral link:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id,
      requestBody: req.body
    });

    res.status(500).json({
      success: false,
      message: 'Error generating referral link'
    });
  }
});

// Get referral tree for a specific user
router.get('/tree/:userId', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'referralCode',
        'totalReferrals', 'directReferrals', 'totalCommissions',
        'currentRank', 'created_at'
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get direct referrals
    const directReferrals = await User.findAll({
      where: { referredBy: userId },
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'referralCode',
        'totalReferrals', 'directReferrals', 'totalCommissions',
        'currentRank', 'created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    // Get up to 3 levels of referrals for each direct referral
    const referralTree = await Promise.all(
      directReferrals.map(async (referral) => {
        const level2 = await User.findAll({
          where: { referredBy: referral.id },
          attributes: [
            'id', 'email', 'firstName', 'lastName', 'referralCode',
            'totalReferrals', 'directReferrals', 'totalCommissions',
            'currentRank', 'created_at'
          ],
          limit: 10 // Limit to prevent too much data
        });

        const level2WithChildren = await Promise.all(
          level2.map(async (l2User) => {
            const level3 = await User.findAll({
              where: { referredBy: l2User.id },
              attributes: [
                'id', 'email', 'firstName', 'lastName', 'referralCode',
                'totalReferrals', 'directReferrals', 'totalCommissions',
                'currentRank', 'created_at'
              ],
              limit: 5 // Further limit for level 3
            });

            return {
              ...l2User.toJSON(),
              referrals: level3
            };
          })
        );

        return {
          ...referral.toJSON(),
          referrals: level2WithChildren
        };
      })
    );

    logger.info(`Admin ${req.user.id} viewed referral tree`, {
      adminId: req.user.id,
      targetUserId: userId,
      directReferralsCount: directReferrals.length
    });

    res.json({
      success: true,
      message: 'Referral tree retrieved successfully',
      data: {
        user: user.toJSON(),
        referrals: referralTree,
        totalLevels: 3,
        directCount: directReferrals.length
      }
    });

  } catch (error) {
    logger.error('Error fetching referral tree:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id,
      userId: req.params.userId
    });

    res.status(500).json({
      success: false,
      message: 'Error fetching referral tree'
    });
  }
});

// Update user referral settings
router.put('/:userId/settings', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { referralCode, isActive, tier } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updates = {};
    if (referralCode && referralCode !== user.referralCode) {
      // Check if new code already exists
      const existingCode = await User.findOne({ 
        where: { 
          referralCode,
          id: { [require('sequelize').Op.ne]: userId }
        }
      });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'Referral code already exists'
        });
      }
      updates.referralCode = referralCode;
    }

    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    if (tier && ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].includes(tier)) {
      updates.currentRank = tier;
    }

    await user.update(updates);

    // Update affiliate record if it exists
    if (updates.referralCode) {
      await Affiliate.update(
        { 
          referralCode: updates.referralCode,
          referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/register?ref=${updates.referralCode}`
        },
        { where: { userId } }
      );
    }

    logger.info('User referral settings updated', {
      adminId: req.user.id,
      userId,
      updates,
      updatedBy: req.user.email
    });

    res.json({
      success: true,
      message: 'User settings updated successfully',
      data: updates
    });

  } catch (error) {
    logger.error('Error updating user settings:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user.id,
      userId: req.params.userId
    });

    res.status(500).json({
      success: false,
      message: 'Error updating user settings'
    });
  }
});

module.exports = router;