const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Basic Information
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    },
    set(value) {
      this.setDataValue('name', value ? value.trim() : value);
    }
  },
  slug: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: true,
    set(value) {
      this.setDataValue('slug', value ? value.toLowerCase().trim() : value);
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    },
    set(value) {
      this.setDataValue('description', value ? value.trim() : value);
    }
  },
  
  // Pricing Information
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  minInvestment: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  maxInvestment: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // Duration and Returns
  durationValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  durationUnit: {
    type: DataTypes.ENUM('days', 'months', 'years'),
    allowNull: false,
    defaultValue: 'days'
  },
  dailyROI: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  totalReturnLimit: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // Features and Benefits (JSON field)
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  
  // Portfolio Type and Category
  type: {
    type: DataTypes.ENUM('Basic', 'Premium', 'Elite'),
    allowNull: false,
    defaultValue: 'Basic'
  },
  category: {
    type: DataTypes.ENUM('30-Day', '365-Day', 'Custom'),
    allowNull: false
  },
  
  // Special Requirements
  subscriptionFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  requiresSubscription: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isElite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Status and Availability
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  availableSlots: {
    type: DataTypes.INTEGER,
    defaultValue: -1 // -1 means unlimited
  },
  usedSlots: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Bot Configuration (JSON field)
  botSettings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: [],
      riskLevel: 'Medium'
    }
  },
  
  // Display Configuration
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  backgroundColor: {
    type: DataTypes.STRING(7),
    defaultValue: '#ffffff',
    validate: {
      is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    }
  },
  textColor: {
    type: DataTypes.STRING(7),
    defaultValue: '#000000',
    validate: {
      is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    }
  },
  gradientColorFrom: {
    type: DataTypes.STRING(7),
    defaultValue: '#3b82f6',
    validate: {
      is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    }
  },
  gradientColorTo: {
    type: DataTypes.STRING(7),
    defaultValue: '#8b5cf6',
    validate: {
      is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    }
  },
  
  // Statistics
  totalSubscribers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  activeSubscribers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalVolume: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  totalReturns: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  
  // Metadata (JSON field)
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      title: '',
      description: '',
      keywords: []
    }
  },
  
  // Audit Trail
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  lastModifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'portfolios',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['type'] },
    { fields: ['category'] },
    { fields: ['is_active', 'is_visible'] },
    { fields: ['display_order'] },
    { fields: ['price'] },
    { fields: ['created_at'] }
  ],
  hooks: {
    beforeCreate: (portfolio) => {
      if (portfolio.name && !portfolio.slug) {
        portfolio.slug = portfolio.name.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
    },
    beforeUpdate: (portfolio) => {
      if (portfolio.changed('name')) {
        portfolio.slug = portfolio.name.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
    },
    beforeSave: (portfolio) => {
      // Validate investment range
      if (parseFloat(portfolio.minInvestment) >= parseFloat(portfolio.maxInvestment)) {
        throw new Error('Maximum investment must be greater than minimum investment');
      }
      
      // Handle elite subscription settings
      if (portfolio.isElite && parseFloat(portfolio.subscriptionFee) <= 0) {
        portfolio.requiresSubscription = true;
        if (parseFloat(portfolio.subscriptionFee) <= 0) {
          portfolio.subscriptionFee = 25; // Default elite subscription fee
        }
      }
    }
  }
});

// Virtual methods and instance methods
Portfolio.prototype.getDurationInDays = function() {
  const multipliers = {
    days: 1,
    months: 30,
    years: 365
  };
  
  return this.durationValue * (multipliers[this.durationUnit] || 1);
};

Portfolio.prototype.getTotalPossibleReturn = function() {
  const days = this.getDurationInDays();
  const dailyReturn = parseFloat(this.dailyROI) / 100;
  return Math.min(days * dailyReturn * 100, parseFloat(this.totalReturnLimit));
};

Portfolio.prototype.getAvailabilityStatus = function() {
  if (!this.isActive || !this.isVisible) return 'unavailable';
  if (this.availableSlots === -1) return 'unlimited';
  if (this.usedSlots >= this.availableSlots) return 'full';
  return 'available';
};

Portfolio.prototype.getRemainingSlots = function() {
  if (this.availableSlots === -1) return -1; // unlimited
  return Math.max(0, this.availableSlots - this.usedSlots);
};

Portfolio.prototype.getFormattedPrice = function() {
  return `$${parseFloat(this.price).toLocaleString()}`;
};

Portfolio.prototype.getInvestmentRange = function() {
  return `$${parseFloat(this.minInvestment).toLocaleString()} - $${parseFloat(this.maxInvestment).toLocaleString()}`;
};

// Instance method to check if user can subscribe
Portfolio.prototype.canUserSubscribe = function(user, investmentAmount) {
  const errors = [];
  
  // Check if portfolio is active and visible
  if (!this.isActive || !this.isVisible) {
    errors.push('This portfolio is currently unavailable');
  }
  
  // Check availability
  if (this.availableSlots !== -1 && this.usedSlots >= this.availableSlots) {
    errors.push('This portfolio is fully subscribed');
  }
  
  // Check investment amount
  if (investmentAmount < parseFloat(this.minInvestment)) {
    errors.push(`Minimum investment is $${parseFloat(this.minInvestment).toLocaleString()}`);
  }
  
  if (investmentAmount > parseFloat(this.maxInvestment)) {
    errors.push(`Maximum investment is $${parseFloat(this.maxInvestment).toLocaleString()}`);
  }
  
  // Check if user already has an active subscription
  if (user.activeSubscription && user.subscriptionStatus === 'active') {
    errors.push('You already have an active subscription');
  }
  
  // Check profile completion for elite packages
  if (this.isElite && !user.isProfileComplete) {
    errors.push('Complete your profile to subscribe to Elite packages');
  }
  
  return {
    canSubscribe: errors.length === 0,
    errors: errors
  };
};

// Instance method to calculate daily earnings
Portfolio.prototype.calculateDailyEarnings = function(investmentAmount) {
  return (investmentAmount * parseFloat(this.dailyROI)) / 100;
};

// Instance method to calculate total earnings for duration
Portfolio.prototype.calculateTotalEarnings = function(investmentAmount) {
  const dailyEarnings = this.calculateDailyEarnings(investmentAmount);
  const totalDays = this.getDurationInDays();
  const maxReturn = (investmentAmount * parseFloat(this.totalReturnLimit)) / 100;
  
  return Math.min(dailyEarnings * totalDays, maxReturn);
};

// Static method to get active portfolios
Portfolio.getActivePortfolios = function() {
  return this.findAll({ 
    where: {
      isActive: true, 
      isVisible: true 
    },
    order: [['displayOrder', 'ASC'], ['created_at', 'DESC']]
  });
};

// Static method to get portfolios by type
Portfolio.getByType = function(type) {
  return this.findAll({ 
    where: {
      type: type,
      isActive: true, 
      isVisible: true 
    },
    order: [['displayOrder', 'ASC']]
  });
};

// Static method to get portfolio statistics
Portfolio.getStatistics = async function() {
  try {
    const stats = await this.findAll({
      where: { isActive: true },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalPortfolios'],
        [sequelize.fn('SUM', sequelize.col('total_subscribers')), 'totalSubscribers'],
        [sequelize.fn('SUM', sequelize.col('total_volume')), 'totalVolume'],
        [sequelize.fn('SUM', sequelize.col('total_returns')), 'totalReturns'],
        [sequelize.fn('AVG', sequelize.col('daily_roi')), 'avgDailyROI'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN type = 'Basic' THEN 1 ELSE 0 END")), 'basicCount'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN type = 'Premium' THEN 1 ELSE 0 END")), 'premiumCount'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN type = 'Elite' THEN 1 ELSE 0 END")), 'eliteCount']
      ],
      raw: true
    });
    
    return stats[0] || {
      totalPortfolios: 0,
      totalSubscribers: 0,
      totalVolume: 0,
      totalReturns: 0,
      avgDailyROI: 0,
      basicCount: 0,
      premiumCount: 0,
      eliteCount: 0
    };
  } catch (error) {
    return {
      totalPortfolios: 0,
      totalSubscribers: 0,
      totalVolume: 0,
      totalReturns: 0,
      avgDailyROI: 0,
      basicCount: 0,
      premiumCount: 0,
      eliteCount: 0
    };
  }
};

module.exports = Portfolio;