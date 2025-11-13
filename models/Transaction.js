const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Basic Information
  transactionId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue('transactionId', value ? value.toUpperCase() : value);
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Transaction Details
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'commission', 'earning', 'bonus', 'penalty', 'refund'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('manual', 'automatic', 'bot', 'referral', 'admin'),
    defaultValue: 'manual'
  },
  
  // Amount Information
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.ENUM('USD', 'USDT', 'BTC', 'ETH', 'BNB'),
    defaultValue: 'USD'
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 6),
    defaultValue: 1.000000,
    validate: {
      min: 0
    }
  },
  
  // Status Information
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'rejected'),
    defaultValue: 'pending'
  },
  
  // Deposit Specific Fields (JSON)
  depositInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  
  // Withdrawal Specific Fields (JSON)
  withdrawalInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  
  // Commission/Referral Specific Fields (JSON)
  referralInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  
  // Bot Earning Specific Fields (JSON)
  botInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  
  // Processing Information
  processedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Additional Information
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
    set(value) {
      this.setDataValue('description', value ? value.trim() : value);
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue('notes', value ? value.trim() : value);
    }
  },
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue('internalNotes', value ? value.trim() : value);
    }
  },
  
  // Tracking Information
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    set(value) {
      this.setDataValue('ipAddress', value ? value.trim() : value);
    }
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue('userAgent', value ? value.trim() : value);
    }
  },
  
  // Balance Information
  balanceBefore: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // Deposit-specific fields
  portfolioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'portfolios',
      key: 'id'
    }
  },
  investmentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  subscriptionFee: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  platformFee: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  paymentMethod: {
    type: DataTypes.ENUM('USDT', 'BTC', 'ETH', 'BNB'),
    allowNull: true
  },
  transactionHash: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  proofImage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rejectedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastModifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  lastModifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Metadata (JSON)
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  
  // Timestamps for different stages
  initiatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Retry and Error Handling
  retryCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lastError: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'created_at'] },
    { fields: ['transaction_id'] },
    { fields: ['type', 'status'] },
    { fields: ['status', 'created_at'] },
    { fields: ['processed_by'] },
    { fields: ['initiated_at'] }
  ],
  hooks: {
    beforeCreate: (transaction) => {
      if (!transaction.transactionId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const typePrefix = transaction.type.toUpperCase().substring(0, 3);
        transaction.transactionId = `${typePrefix}${timestamp}${random}`;
      }
    },
    beforeUpdate: (transaction) => {
      if (transaction.changed('status') && transaction.status === 'completed' && !transaction.completedAt) {
        transaction.completedAt = new Date();
      }
      
      // Calculate net amount for withdrawals
      if (transaction.type === 'withdrawal' && transaction.withdrawalInfo) {
        if (!transaction.withdrawalInfo.netAmount) {
          const fee = transaction.withdrawalInfo.processingFee || 0;
          transaction.withdrawalInfo = {
            ...transaction.withdrawalInfo,
            netAmount: Math.max(0, parseFloat(transaction.amount) - fee)
          };
        }
      }
    }
  }
});

// Instance methods
Transaction.prototype.getFormattedAmount = function() {
  return `${this.currency} ${parseFloat(this.amount).toLocaleString()}`;
};

Transaction.prototype.getProcessingTime = function() {
  if (this.completedAt && this.initiatedAt) {
    return this.completedAt.getTime() - this.initiatedAt.getTime();
  }
  return null;
};

Transaction.prototype.getStatusColor = function() {
  const colors = {
    pending: 'yellow',
    processing: 'blue',
    completed: 'green',
    failed: 'red',
    cancelled: 'gray',
    rejected: 'red'
  };
  return colors[this.status] || 'gray';
};

Transaction.prototype.getDirection = function() {
  const creditTypes = ['deposit', 'commission', 'earning', 'bonus', 'refund'];
  return creditTypes.includes(this.type) ? 'credit' : 'debit';
};

// Instance method to approve transaction
Transaction.prototype.approve = async function(approver, notes) {
  this.status = 'completed';
  this.approvedBy = approver;
  this.approvedAt = new Date();
  this.completedAt = new Date();
  if (notes) {
    this.internalNotes = notes;
  }
  return await this.save();
};

// Instance method to reject transaction
Transaction.prototype.reject = async function(approver, reason) {
  this.status = 'rejected';
  this.approvedBy = approver;
  this.approvedAt = new Date();
  this.completedAt = new Date();
  if (reason) {
    this.internalNotes = reason;
  }
  return await this.save();
};

// Instance method to process transaction
Transaction.prototype.process = async function(processor) {
  this.status = 'processing';
  this.processedBy = processor;
  this.processedAt = new Date();
  return await this.save();
};

// Instance method to mark as failed
Transaction.prototype.markAsFailed = async function(error) {
  this.status = 'failed';
  this.completedAt = new Date();
  if (error) {
    this.lastError = {
      message: error.message,
      code: error.code,
      timestamp: new Date()
    };
  }
  return await this.save();
};

// Instance method to retry transaction
Transaction.prototype.retry = async function() {
  this.retryCount += 1;
  this.status = 'pending';
  this.completedAt = null;
  this.lastError = null;
  return await this.save();
};

// Static method to get user transactions
Transaction.getUserTransactions = function(userId, options = {}) {
  const {
    type,
    status,
    limit = 20,
    offset = 0,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = options;
  
  const where = { userId: userId };
  
  if (type) where.type = type;
  if (status) where.status = status;
  
  return this.findAll({
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    include: [
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }
    ]
  });
};

// Static method to get pending transactions for admin
Transaction.getPendingForAdmin = function(type) {
  const where = { status: 'pending' };
  if (type) where.type = type;
  
  return this.findAll({
    where,
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'walletAddress', 'phoneNumber']
      }
    ]
  });
};

// Static method to get transaction statistics
Transaction.getStatistics = async function(userId, dateRange) {
  const where = {};
  
  if (userId) {
    where.userId = userId;
  }
  
  if (dateRange && dateRange.from && dateRange.to) {
    where.createdAt = {
      [sequelize.Op.between]: [new Date(dateRange.from), new Date(dateRange.to)]
    };
  }
  
  try {
    const stats = await this.findAll({
      where,
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'pending' THEN amount ELSE 0 END")), 'pendingAmount'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'completed' THEN amount ELSE 0 END")), 'completedAmount']
      ],
      group: ['type'],
      raw: true
    });
    
    // Transform to more readable format
    const result = {
      total: { count: 0, amount: 0 },
      deposit: { count: 0, total: 0, pending: 0, completed: 0 },
      withdrawal: { count: 0, total: 0, pending: 0, completed: 0 },
      commission: { count: 0, total: 0, pending: 0, completed: 0 },
      earning: { count: 0, total: 0, pending: 0, completed: 0 }
    };
    
    stats.forEach(stat => {
      const count = parseInt(stat.count) || 0;
      const totalAmount = parseFloat(stat.totalAmount) || 0;
      const pendingAmount = parseFloat(stat.pendingAmount) || 0;
      const completedAmount = parseFloat(stat.completedAmount) || 0;
      
      result.total.count += count;
      result.total.amount += totalAmount;
      
      if (result[stat.type]) {
        result[stat.type] = {
          count,
          total: totalAmount,
          pending: pendingAmount,
          completed: completedAmount
        };
      }
    });
    
    return result;
  } catch (error) {
    return {
      total: { count: 0, amount: 0 },
      deposit: { count: 0, total: 0, pending: 0, completed: 0 },
      withdrawal: { count: 0, total: 0, pending: 0, completed: 0 },
      commission: { count: 0, total: 0, pending: 0, completed: 0 },
      earning: { count: 0, total: 0, pending: 0, completed: 0 }
    };
  }
};

// Static method to create deposit transaction
Transaction.createDeposit = function(data) {
  return this.create({
    userId: data.userId,
    type: 'deposit',
    category: 'manual',
    amount: data.amount,
    currency: data.currency || 'USD',
    status: 'pending',
    balanceBefore: data.balanceBefore,
    balanceAfter: data.balanceBefore, // Will be updated when approved
    depositInfo: {
      portfolio: data.portfolioId,
      investmentAmount: data.amount,
      paymentMethod: data.paymentMethod || 'crypto',
      paymentProof: data.paymentProof,
      senderAddress: data.senderAddress,
      receiverAddress: data.receiverAddress,
      transactionHash: data.transactionHash
    },
    description: data.description || 'Portfolio investment deposit',
    ipAddress: data.ipAddress,
    userAgent: data.userAgent
  });
};

// Static method to create withdrawal transaction
Transaction.createWithdrawal = function(data) {
  return this.create({
    userId: data.userId,
    type: 'withdrawal',
    category: 'manual',
    amount: data.amount,
    currency: data.currency || 'USD',
    status: 'pending',
    balanceBefore: data.balanceBefore,
    balanceAfter: parseFloat(data.balanceBefore) - parseFloat(data.amount),
    withdrawalInfo: {
      walletAddress: data.walletAddress,
      withdrawalMethod: data.withdrawalMethod || 'crypto',
      processingFee: data.processingFee || 0,
      netAmount: parseFloat(data.amount) - (parseFloat(data.processingFee) || 0),
      bankDetails: data.bankDetails
    },
    description: data.description || 'Withdrawal request',
    ipAddress: data.ipAddress,
    userAgent: data.userAgent
  });
};

// Static method to create commission transaction
Transaction.createCommission = function(data) {
  return this.create({
    userId: data.userId,
    type: 'commission',
    category: 'automatic',
    amount: data.amount,
    currency: data.currency || 'USD',
    status: 'completed',
    balanceBefore: data.balanceBefore,
    balanceAfter: parseFloat(data.balanceBefore) + parseFloat(data.amount),
    referralInfo: {
      fromUser: data.fromUserId,
      level: data.level,
      percentage: data.percentage,
      originalAmount: data.originalAmount,
      referralType: data.referralType || 'direct'
    },
    description: `Level ${data.level} referral commission`,
    completedAt: new Date()
  });
};

module.exports = Transaction;