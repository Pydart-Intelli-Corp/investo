const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  portfolioId: {
    type: DataTypes.INTEGER,
    field: 'portfolio_id',
    allowNull: false,
    references: {
      model: 'portfolios',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subscriptionFee: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'subscription_fee',
    allowNull: false,
    defaultValue: 25.00
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    field: 'total_amount',
    allowNull: false
  },
  paymentType: {
    type: DataTypes.STRING(20),
    field: 'payment_type',
    allowNull: false,
    defaultValue: 'USDT',
    validate: {
      isIn: [['USDT', 'BTC', 'ETH', 'BNB', 'LTC', 'DOGE']]
    }
  },
  networkType: {
    type: DataTypes.STRING(50),
    field: 'network_type',
    allowNull: false,
    defaultValue: 'BEP20'
  },
  adminWalletId: {
    type: DataTypes.INTEGER,
    field: 'admin_wallet_id',
    allowNull: false,
    references: {
      model: 'admin_wallets',
      key: 'id'
    }
  },
  paymentScreenshot: {
    type: DataTypes.STRING(500),
    field: 'payment_screenshot',
    allowNull: true
  },
  screenshotUrl: {
    type: DataTypes.STRING(500),
    field: 'screenshot_url',
    allowNull: true
  },
  transactionHash: {
    type: DataTypes.STRING(255),
    field: 'transaction_hash',
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDING',
    validate: {
      isIn: [['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED']]
    }
  },
  adminNotes: {
    type: DataTypes.TEXT,
    field: 'admin_notes',
    allowNull: true
  },
  processedBy: {
    type: DataTypes.INTEGER,
    field: 'processed_by',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  processedAt: {
    type: DataTypes.DATE,
    field: 'processed_at',
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    field: 'rejection_reason',
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Payment;