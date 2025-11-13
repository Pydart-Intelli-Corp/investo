const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdminWallet = sequelize.define('AdminWallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  walletType: {
    type: DataTypes.STRING(20),
    field: 'wallet_type',
    allowNull: false,
    validate: {
      isIn: [['USDT', 'BTC', 'ETH', 'BNB', 'LTC', 'DOGE']]
    }
  },
  walletAddress: {
    type: DataTypes.STRING(255),
    field: 'wallet_address',
    allowNull: false,
    validate: {
      len: [25, 255]
    }
  },
  qrCodeImage: {
    type: DataTypes.TEXT,
    field: 'qr_code_image',
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  networkType: {
    type: DataTypes.STRING(50),
    field: 'network_type',
    allowNull: false,
    defaultValue: 'TRC20'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by',
    allowNull: false
  }
}, {
  tableName: 'admin_wallets',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AdminWallet;