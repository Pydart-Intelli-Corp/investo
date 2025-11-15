const { User, Transaction, Affiliate } = require('../models');
const logger = require('./logger');

/**
 * Commission rates for each referral level
 * Level 1 (Direct): 10%
 * Level 2: 5%
 * Level 3: 3%
 * Level 4: 2%
 * Level 5: 1%
 */
const COMMISSION_RATES = {
  1: 0.10, // 10%
  2: 0.05, // 5%
  3: 0.03, // 3%
  4: 0.02, // 2%
  5: 0.01  // 1%
};

/**
 * Calculate and distribute referral commissions up to 5 levels
 * @param {number} userId - The user who made the investment
 * @param {number} investmentAmount - The amount invested
 * @param {string} description - Description for the transaction
 * @returns {Promise<Object>} - Summary of distributed commissions
 */
async function distributeReferralCommissions(userId, investmentAmount, description = 'Investment') {
  try {
    const distributedCommissions = [];
    let currentUserId = userId;
    let currentLevel = 1;

    // Get the initial user to start the referral chain
    let currentUser = await User.findByPk(userId, {
      attributes: ['id', 'referredBy', 'firstName', 'lastName', 'email']
    });

    if (!currentUser) {
      logger.error('User not found for commission distribution', { userId });
      return { success: false, error: 'User not found' };
    }

    // Traverse up the referral chain (up to 5 levels)
    while (currentLevel <= 5 && currentUser && currentUser.referredBy) {
      // Get the referrer
      const referrer = await User.findByPk(currentUser.referredBy, {
        attributes: [
          'id', 'firstName', 'lastName', 'email', 'walletBalance',
          'totalCommissions', 'totalEarnings', 'referralCode', 'referredBy', 'isActive'
        ]
      });

      if (!referrer) {
        logger.warn(`Referrer not found at level ${currentLevel}`, {
          userId: currentUser.id,
          referredBy: currentUser.referredBy
        });
        break;
      }

      // Skip inactive users
      if (!referrer.isActive) {
        logger.warn(`Skipping inactive referrer at level ${currentLevel}`, {
          referrerId: referrer.id,
          level: currentLevel
        });
        currentUser = referrer;
        currentLevel++;
        continue;
      }

      // Calculate commission for this level
      const commissionRate = COMMISSION_RATES[currentLevel];
      const commissionAmount = investmentAmount * commissionRate;

      // Get current balance
      const balanceBefore = parseFloat(referrer.walletBalance || 0);
      const balanceAfter = balanceBefore + commissionAmount;

      // Generate transaction ID
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const transactionId = `COM${timestamp}${random}`;

      // Create commission transaction with all required fields
      const transaction = await Transaction.create({
        transactionId: transactionId,
        userId: referrer.id,
        amount: commissionAmount,
        type: 'commission',
        category: 'referral',
        status: 'completed',
        currency: 'USD',
        balanceBefore: balanceBefore,
        balanceAfter: balanceAfter,
        description: `Level ${currentLevel} referral commission from ${currentUser.firstName} ${currentUser.lastName} - ${description}`,
        referralInfo: {
          level: currentLevel,
          fromUserId: userId,
          fromUserName: `${currentUser.firstName} ${currentUser.lastName}`,
          investmentAmount: investmentAmount,
          commissionRate: commissionRate * 100 + '%'
        },
        completedAt: new Date()
      });

      // Update referrer's wallet balance, total commissions, and total earnings
      const newWalletBalance = balanceAfter;
      const newTotalCommissions = parseFloat(referrer.totalCommissions || 0) + commissionAmount;
      const newTotalEarnings = parseFloat(referrer.totalEarnings || 0) + commissionAmount;

      await referrer.update({
        walletBalance: newWalletBalance,
        totalCommissions: newTotalCommissions,
        totalEarnings: newTotalEarnings
      });

      // Update affiliate record
      const affiliate = await Affiliate.findOne({ where: { userId: referrer.id } });
      if (affiliate) {
        // Update total commissions
        const affiliateTotalCommissions = parseFloat(affiliate.totalCommissions || 0) + commissionAmount;
        const availableCommissions = parseFloat(affiliate.availableCommissions || 0) + commissionAmount;

        // Update level earnings - Create new object to force Sequelize to detect change
        const currentLevelEarnings = affiliate.levelEarnings || {
          level1: 0, level2: 0, level3: 0, level4: 0, level5: 0
        };
        const levelKey = `level${currentLevel}`;
        const newLevelEarnings = {
          ...currentLevelEarnings,
          [levelKey]: (parseFloat(currentLevelEarnings[levelKey]) || 0) + commissionAmount
        };

        await affiliate.update({
          totalCommissions: affiliateTotalCommissions,
          availableCommissions: availableCommissions,
          levelEarnings: newLevelEarnings,
          lastCommissionDate: new Date()
        });

        // Mark the field as changed to ensure Sequelize saves it
        affiliate.changed('levelEarnings', true);
        await affiliate.save();
      }

      distributedCommissions.push({
        level: currentLevel,
        referrerId: referrer.id,
        referrerName: `${referrer.firstName} ${referrer.lastName}`,
        referrerEmail: referrer.email,
        commissionAmount: commissionAmount,
        commissionRate: (commissionRate * 100) + '%',
        transactionId: transaction.id
      });

      logger.info(`Commission distributed at level ${currentLevel}`, {
        referrerId: referrer.id,
        level: currentLevel,
        amount: commissionAmount,
        investmentAmount: investmentAmount
      });

      // Move to next level
      currentUser = referrer;
      currentLevel++;
    }

    return {
      success: true,
      totalLevels: distributedCommissions.length,
      totalCommissionsDistributed: distributedCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      commissions: distributedCommissions
    };

  } catch (error) {
    logger.error('Error distributing referral commissions', {
      error: error.message,
      stack: error.stack,
      userId,
      investmentAmount
    });
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calculate potential commissions without actually distributing them
 * Useful for showing users potential earnings
 */
async function calculatePotentialCommissions(userId, investmentAmount) {
  try {
    const potentialCommissions = [];
    let currentUserId = userId;
    let currentLevel = 1;

    let currentUser = await User.findByPk(userId, {
      attributes: ['id', 'referredBy', 'firstName', 'lastName']
    });

    while (currentLevel <= 5 && currentUser && currentUser.referredBy) {
      const referrer = await User.findByPk(currentUser.referredBy, {
        attributes: ['id', 'firstName', 'lastName', 'isActive']
      });

      if (!referrer || !referrer.isActive) {
        break;
      }

      const commissionRate = COMMISSION_RATES[currentLevel];
      const commissionAmount = investmentAmount * commissionRate;

      potentialCommissions.push({
        level: currentLevel,
        referrerId: referrer.id,
        referrerName: `${referrer.firstName} ${referrer.lastName}`,
        commissionAmount: commissionAmount,
        commissionRate: (commissionRate * 100) + '%'
      });

      currentUser = referrer;
      currentLevel++;
    }

    return {
      success: true,
      potentialCommissions: potentialCommissions,
      totalPotential: potentialCommissions.reduce((sum, c) => sum + c.commissionAmount, 0)
    };

  } catch (error) {
    logger.error('Error calculating potential commissions', {
      error: error.message,
      userId,
      investmentAmount
    });
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  distributeReferralCommissions,
  calculatePotentialCommissions,
  COMMISSION_RATES
};
