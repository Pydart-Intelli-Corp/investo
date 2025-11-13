const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Basic Information
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [1, 255]
    },
    set(value) {
      this.setDataValue('email', value ? value.toLowerCase().trim() : value);
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  
  // Profile Information
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50]
    },
    set(value) {
      this.setDataValue('firstName', value ? value.trim() : value);
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50]
    },
    set(value) {
      this.setDataValue('lastName', value ? value.trim() : value);
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^\+?[\d\s-()]+$/
    },
    set(value) {
      this.setDataValue('phoneNumber', value ? value.trim() : value);
    }
  },
  
  // Wallet Information
  walletAddress: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100]
    },
    set(value) {
      this.setDataValue('walletAddress', value ? value.trim() : value);
    }
  },
  walletQRCode: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue('walletQRCode', value ? value.trim() : value);
    }
  },
  qrCodeUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue('qrCodeUrl', value ? value.trim() : value);
    }
  },
  
  // Account Status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isProfileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'superadmin'),
    defaultValue: 'user'
  },
  
  // Referral System
  referralCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue('referralCode', value ? value.toUpperCase() : value);
    }
  },
  referredBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  referralLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 15
    }
  },
  totalReferrals: {
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
  
  // Financial Information
  walletBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  totalDeposited: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    field: 'total_deposited',
    validate: {
      min: 0
    }
  },
  totalWithdrawn: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  totalCommissions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  
  // Rank System
  currentRank: {
    type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'),
    defaultValue: 'Bronze'
  },
  rankUpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  // Subscription Information
  activeSubscription: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'portfolios',
      key: 'id'
    }
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('none', 'pending', 'active', 'expired', 'cancelled'),
    defaultValue: 'none'
  },
  subscriptionStartDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Bot Status
  botActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  botActivatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dailyROI: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 10
    }
  },
  
  // Security
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailVerificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  emailVerificationExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailVerificationOTP: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  otpExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  otpAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Timestamps
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastActivity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['referral_code'] },
    { fields: ['referred_by'] },
    { fields: ['current_rank'] },
    { fields: ['is_active'] },
    { fields: ['created_at'] }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
      if (!user.referralCode) {
        user.referralCode = user.generateReferralCode();
      }
      // Update profile completion status
      user.isProfileComplete = !!(
        user.email &&
        user.phoneNumber &&
        user.walletAddress &&
        user.firstName &&
        user.lastName
      );
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
      // Update profile completion status
      user.isProfileComplete = !!(
        user.email &&
        user.phoneNumber &&
        user.walletAddress &&
        user.firstName &&
        user.lastName
      );
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

User.prototype.generateReferralCode = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BTC${timestamp}${random}`.toUpperCase();
};

User.prototype.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

User.prototype.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return verificationToken;
};

// Generate OTP for email verification
User.prototype.generateEmailOTP = function() {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.emailVerificationOTP = otp;
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  this.otpAttempts = 0; // Reset attempts when new OTP is generated
  
  return otp;
};

// Verify OTP
User.prototype.verifyOTP = function(inputOTP) {
  // Check if OTP is expired
  if (!this.otpExpires || new Date() > this.otpExpires) {
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }
  
  // Check if too many attempts
  if (this.otpAttempts >= 5) {
    return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
  }
  
  // Check if OTP matches
  if (this.emailVerificationOTP !== inputOTP) {
    this.otpAttempts += 1;
    return { 
      success: false, 
      message: `Invalid OTP. ${5 - this.otpAttempts} attempts remaining.`,
      attemptsLeft: 5 - this.otpAttempts
    };
  }
  
  // OTP is valid
  return { success: true, message: 'OTP verified successfully.' };
};

// Clear OTP data after successful verification
User.prototype.clearOTP = function() {
  this.emailVerificationOTP = null;
  this.otpExpires = null;
  this.otpAttempts = 0;
};

User.prototype.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.update({
      lockUntil: null,
      loginAttempts: 1
    });
    return;
  }
  
  const updates = { loginAttempts: this.loginAttempts + 1 };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.getIsLocked()) {
    updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);
  }
  
  await this.update(updates);
};

User.prototype.resetLoginAttempts = async function() {
  await this.update({
    loginAttempts: 0,
    lockUntil: null
  });
};

User.prototype.updateRank = function() {
  // Rank system simplified - no longer based on deposits
  // Keep Bronze as default rank for all users
  let newRank = 'Bronze';
  
  if (newRank !== this.currentRank) {
    this.currentRank = newRank;
    this.rankUpdatedAt = new Date();
    return true; // Rank changed
  }
  
  return false; // No rank change
};

// Virtual attributes
User.prototype.getFullName = function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || 'User';
};

User.prototype.getReferralLink = function() {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${frontendUrl}/register?ref=${this.referralCode}`;
};

User.prototype.getIsLocked = function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Class methods
User.findByReferralCode = function(referralCode) {
  return this.findOne({ 
    where: { referralCode: referralCode.toUpperCase() }
  });
};

User.getReferralTree = async function(userId, levels = 15) {
  // This is a simplified version - for complex hierarchical queries, 
  // you might want to use recursive CTEs or multiple queries
  const directReferrals = await this.findAll({
    where: { referredBy: userId },
    include: [{
      model: this,
      as: 'referrals',
      required: false
    }]
  });
  
  return directReferrals;
};

User.getTeamStats = async function(userId) {
  // Simplified team stats - in production, you'd want more sophisticated queries
  const directReferrals = await this.findAll({
    where: { referredBy: userId }
  });
  
  let totalTeamSize = directReferrals.length;
  let totalTeamVolume = directReferrals.reduce((sum, user) => {
    return sum + parseFloat(user.totalDeposited || 0);
  }, 0);
  
  // For now, just count direct referrals
  // In production, you'd implement recursive counting
  
  return {
    totalTeamSize,
    totalTeamVolume
  };
};

module.exports = User;