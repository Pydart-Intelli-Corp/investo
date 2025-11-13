const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Affiliate = sequelize.define('Affiliate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // User Information
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Referral Information
  referralCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue('referralCode', value ? value.toUpperCase() : value);
    }
  },
  referralLink: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  
  // Referral Statistics
  totalReferrals: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  activeReferrals: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  directReferrals: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Level-wise Referral Counts (JSON)
  levelCounts: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      level1: 0, level2: 0, level3: 0, level4: 0, level5: 0,
      level6: 0, level7: 0, level8: 0, level9: 0, level10: 0,
      level11: 0, level12: 0, level13: 0, level14: 0, level15: 0
    }
  },
  
  // Commission Statistics
  totalCommissions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  availableCommissions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  withdrawnCommissions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  pendingCommissions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  
  // Level-wise Commission Earnings (JSON)
  levelEarnings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      level1: 0, level2: 0, level3: 0, level4: 0, level5: 0,
      level6: 0, level7: 0, level8: 0, level9: 0, level10: 0,
      level11: 0, level12: 0, level13: 0, level14: 0, level15: 0
    }
  },
  
  // Team Statistics (JSON)
  teamStats: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      totalTeamSize: 0,
      activeTeamMembers: 0,
      totalTeamVolume: 0,
      teamEarnings: 0
    }
  },
  
  // Performance Metrics (JSON)
  performanceMetrics: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      conversionRate: 0,
      averageInvestment: 0,
      topPerformerLevel: 1,
      monthlyGrowthRate: 0,
      retentionRate: 0
    }
  },
  
  // Tracking and Analytics (JSON)
  clickStats: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      totalClicks: 0,
      uniqueClicks: 0,
      todayClicks: 0,
      thisWeekClicks: 0,
      thisMonthClicks: 0,
      lastClickAt: null
    }
  },
  
  // Commission Settings (JSON)
  commissionSettings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      customRates: {
        level1: null, level2: null, level3: null, level4: null, level5: null,
        level6: null, level7: null, level8: null, level9: null, level10: null,
        level11: null, level12: null, level13: null, level14: null, level15: null
      },
      bonusMultiplier: 1,
      specialBonus: 0
    }
  },
  
  // Achievements and Milestones (JSON)
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  
  // Marketing Tools (JSON)
  marketingTools: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      customBanners: [],
      emailTemplates: [],
      socialMediaLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        telegram: '',
        whatsapp: ''
      }
    }
  },
  
  // Status and Settings
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPremiumAffiliate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tier: {
    type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Diamond'),
    defaultValue: 'Bronze'
  },
  
  // Payout Settings (JSON)
  payoutSettings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      minimumPayout: 50,
      payoutMethod: 'wallet',
      autoPayoutEnabled: false,
      payoutSchedule: 'manual'
    }
  },
  
  // Important Dates
  firstReferralDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastCommissionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tierUpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'affiliates',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['referral_code'] },
    { fields: ['tier'] },
    { fields: ['is_active'] },
    { fields: ['total_commissions'] },
    { fields: ['total_referrals'] },
    { fields: ['created_at'] }
  ],
  hooks: {
    beforeSave: (affiliate) => {
      const oldTier = affiliate._previousDataValues ? affiliate._previousDataValues.tier : null;
      
      // Tier calculation based on team volume and referrals
      const teamVolume = affiliate.teamStats?.totalTeamVolume || 0;
      const totalReferrals = affiliate.totalReferrals || 0;
      
      if (teamVolume >= 1000000 && totalReferrals >= 100) {
        affiliate.tier = 'Diamond';
      } else if (teamVolume >= 250000 && totalReferrals >= 50) {
        affiliate.tier = 'Gold';
      } else if (teamVolume >= 50000 && totalReferrals >= 20) {
        affiliate.tier = 'Silver';
      } else {
        affiliate.tier = 'Bronze';
      }
      
      // Update tier timestamp if tier changed
      if (oldTier && oldTier !== affiliate.tier) {
        affiliate.tierUpdatedAt = new Date();
      }
    }
  }
});

// Virtual methods
Affiliate.prototype.getActiveLevels = function() {
  let count = 0;
  const levelCounts = this.levelCounts || {};
  for (let i = 1; i <= 15; i++) {
    if (levelCounts[`level${i}`] > 0) {
      count = i;
    }
  }
  return count;
};

Affiliate.prototype.getCommissionConversionRate = function() {
  if (this.totalReferrals === 0) return 0;
  return ((parseFloat(this.totalCommissions) / this.totalReferrals) * 100).toFixed(2);
};

Affiliate.prototype.getTeamPerformanceScore = function() {
  const weights = {
    teamSize: 0.3,
    teamVolume: 0.4,
    commissions: 0.3
  };
  
  const teamStats = this.teamStats || {};
  // Normalize values (this is a simplified calculation)
  const normalizedTeamSize = Math.min((teamStats.totalTeamSize || 0) / 100, 1);
  const normalizedVolume = Math.min((teamStats.totalTeamVolume || 0) / 100000, 1);
  const normalizedCommissions = Math.min(parseFloat(this.totalCommissions) / 10000, 1);
  
  const score = (
    normalizedTeamSize * weights.teamSize +
    normalizedVolume * weights.teamVolume +
    normalizedCommissions * weights.commissions
  ) * 100;
  
  return Math.round(score);
};

// Instance method to add referral
Affiliate.prototype.addReferral = async function(level = 1) {
  this.totalReferrals += 1;
  
  if (level === 1) {
    this.directReferrals += 1;
  }
  
  if (level >= 1 && level <= 15) {
    const levelCounts = { ...this.levelCounts };
    levelCounts[`level${level}`] = (levelCounts[`level${level}`] || 0) + 1;
    this.levelCounts = levelCounts;
  }
  
  if (!this.firstReferralDate) {
    this.firstReferralDate = new Date();
  }
  
  return await this.save();
};

// Instance method to add commission
Affiliate.prototype.addCommission = async function(amount, level = 1) {
  this.totalCommissions = parseFloat(this.totalCommissions) + amount;
  this.availableCommissions = parseFloat(this.availableCommissions) + amount;
  
  if (level >= 1 && level <= 15) {
    const levelEarnings = { ...this.levelEarnings };
    levelEarnings[`level${level}`] = (levelEarnings[`level${level}`] || 0) + amount;
    this.levelEarnings = levelEarnings;
  }
  
  this.lastCommissionDate = new Date();
  
  return await this.save();
};

// Instance method to process commission withdrawal
Affiliate.prototype.withdrawCommission = async function(amount) {
  if (amount > parseFloat(this.availableCommissions)) {
    throw new Error('Insufficient available commission balance');
  }
  
  this.availableCommissions = parseFloat(this.availableCommissions) - amount;
  this.withdrawnCommissions = parseFloat(this.withdrawnCommissions) + amount;
  
  return await this.save();
};

// Instance method to track referral link click
Affiliate.prototype.trackClick = async function(isUnique = false) {
  const clickStats = { ...this.clickStats };
  clickStats.totalClicks = (clickStats.totalClicks || 0) + 1;
  clickStats.lastClickAt = new Date();
  
  if (isUnique) {
    clickStats.uniqueClicks = (clickStats.uniqueClicks || 0) + 1;
  }
  
  // Update daily/weekly/monthly counters (simplified)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!clickStats.lastClickAt || new Date(clickStats.lastClickAt) < today) {
    clickStats.todayClicks = 1;
  } else {
    clickStats.todayClicks = (clickStats.todayClicks || 0) + 1;
  }
  
  this.clickStats = clickStats;
  return await this.save();
};

// Instance method to calculate commission for level
Affiliate.prototype.getCommissionRate = function(level) {
  const commissionSettings = this.commissionSettings || {};
  const customRates = commissionSettings.customRates || {};
  
  // Check for custom rates first
  const customRate = customRates[`level${level}`];
  if (customRate !== null && customRate !== undefined) {
    return customRate;
  }
  
  // Use default rates from environment
  const defaultRates = {
    1: parseFloat(process.env.LEVEL_1_COMMISSION) || 5.0,
    2: parseFloat(process.env.LEVEL_2_COMMISSION) || 2.0,
    3: parseFloat(process.env.LEVEL_3_COMMISSION) || 2.0,
    4: parseFloat(process.env.LEVEL_4_COMMISSION) || 2.0,
    5: parseFloat(process.env.LEVEL_5_COMMISSION) || 2.0,
    6: parseFloat(process.env.LEVEL_6_COMMISSION) || 1.0,
    7: parseFloat(process.env.LEVEL_7_COMMISSION) || 1.0,
    8: parseFloat(process.env.LEVEL_8_COMMISSION) || 1.0,
    9: parseFloat(process.env.LEVEL_9_COMMISSION) || 1.0,
    10: parseFloat(process.env.LEVEL_10_COMMISSION) || 1.0,
    11: parseFloat(process.env.LEVEL_11_COMMISSION) || 0.5,
    12: parseFloat(process.env.LEVEL_12_COMMISSION) || 0.5,
    13: parseFloat(process.env.LEVEL_13_COMMISSION) || 0.5,
    14: parseFloat(process.env.LEVEL_14_COMMISSION) || 0.5,
    15: parseFloat(process.env.LEVEL_15_COMMISSION) || 0.5
  };
  
  return defaultRates[level] || 0;
};

// Instance method to add achievement
Affiliate.prototype.addAchievement = async function(name, description, reward = 0, badge = null) {
  const achievements = [...(this.achievements || [])];
  
  // Check if achievement already exists
  const existingAchievement = achievements.find(a => a.name === name);
  if (existingAchievement) {
    return false; // Achievement already earned
  }
  
  achievements.push({
    name,
    description,
    reward,
    badge,
    earnedAt: new Date()
  });
  
  this.achievements = achievements;
  
  if (reward > 0) {
    this.availableCommissions = parseFloat(this.availableCommissions) + reward;
  }
  
  await this.save();
  return true;
};

// Static method to get top affiliates
Affiliate.getTopAffiliates = function(limit = 10, sortBy = 'totalCommissions') {
  const validSortFields = ['totalCommissions', 'totalReferrals'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'totalCommissions';
  
  return this.findAll({
    where: { isActive: true },
    order: [[sortField, 'DESC']],
    limit,
    include: [
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'currentRank']
      }
    ]
  });
};

// Static method to get affiliate statistics
Affiliate.getGlobalStats = async function() {
  try {
    const stats = await this.findAll({
      where: { isActive: true },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAffiliates'],
        [sequelize.fn('SUM', sequelize.col('total_referrals')), 'totalReferrals'],
        [sequelize.fn('SUM', sequelize.col('total_commissions')), 'totalCommissions'],
        [sequelize.fn('AVG', sequelize.col('total_commissions')), 'avgCommissionsPerAffiliate'],
        [sequelize.fn('AVG', sequelize.col('total_referrals')), 'avgReferralsPerAffiliate'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tier = 'Bronze' THEN 1 ELSE 0 END")), 'bronzeCount'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tier = 'Silver' THEN 1 ELSE 0 END")), 'silverCount'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tier = 'Gold' THEN 1 ELSE 0 END")), 'goldCount'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tier = 'Diamond' THEN 1 ELSE 0 END")), 'diamondCount']
      ],
      raw: true
    });
    
    return stats[0] || {
      totalAffiliates: 0,
      totalReferrals: 0,
      totalCommissions: 0,
      totalTeamVolume: 0,
      avgCommissionsPerAffiliate: 0,
      avgReferralsPerAffiliate: 0,
      bronzeCount: 0,
      silverCount: 0,
      goldCount: 0,
      diamondCount: 0
    };
  } catch (error) {
    return {
      totalAffiliates: 0,
      totalReferrals: 0,
      totalCommissions: 0,
      totalTeamVolume: 0,
      avgCommissionsPerAffiliate: 0,
      avgReferralsPerAffiliate: 0,
      bronzeCount: 0,
      silverCount: 0,
      goldCount: 0,
      diamondCount: 0
    };
  }
};

// Static method to find affiliate by referral code
Affiliate.findByReferralCode = function(referralCode) {
  return this.findOne({ 
    where: {
      referralCode: referralCode.toUpperCase(),
      isActive: true 
    },
    include: [
      {
        model: sequelize.models.User,
        as: 'user'
      }
    ]
  });
};

module.exports = Affiliate;