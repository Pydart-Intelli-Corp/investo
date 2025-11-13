const { sequelize } = require('../config/database');

// Initialize all models
const User = require('./User');
const Portfolio = require('./Portfolio');
const Transaction = require('./Transaction');
const Affiliate = require('./Affiliate');
const AdminWallet = require('./AdminWallet');
const Payment = require('./Payment');

// Create models object for associations
const models = {
  User,
  Portfolio,
  Transaction,
  Affiliate,
  AdminWallet,
  Payment
};

// Define associations
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Portfolio, { foreignKey: 'createdBy', as: 'createdPortfolios' });
Portfolio.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Portfolio, { foreignKey: 'lastModifiedBy', as: 'modifiedPortfolios' });
Portfolio.belongsTo(User, { foreignKey: 'lastModifiedBy', as: 'lastModifier' });

User.belongsTo(Portfolio, { foreignKey: 'activeSubscription', as: 'subscription' });
Portfolio.hasMany(User, { foreignKey: 'activeSubscription', as: 'subscribers' });

User.hasOne(Affiliate, { foreignKey: 'userId', as: 'affiliate' });
Affiliate.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Self-referential relationship for user referrals
User.hasMany(User, { foreignKey: 'referredBy', as: 'referrals' });
User.belongsTo(User, { foreignKey: 'referredBy', as: 'referrer' });

// Transaction processors and approvers
Transaction.belongsTo(User, { foreignKey: 'processedBy', as: 'processor' });
Transaction.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });
Transaction.belongsTo(User, { foreignKey: 'rejectedBy', as: 'rejector' });
Transaction.belongsTo(User, { foreignKey: 'lastModifiedBy', as: 'lastModifier' });

// Transaction portfolio association
Transaction.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
Portfolio.hasMany(Transaction, { foreignKey: 'portfolioId', as: 'transactions' });

// Payment associations
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });

Payment.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
Portfolio.hasMany(Payment, { foreignKey: 'portfolioId', as: 'payments' });

Payment.belongsTo(AdminWallet, { foreignKey: 'adminWalletId', as: 'adminWallet' });
AdminWallet.hasMany(Payment, { foreignKey: 'adminWalletId', as: 'payments' });

Payment.belongsTo(User, { foreignKey: 'processedBy', as: 'processedByUser' });
User.hasMany(Payment, { foreignKey: 'processedBy', as: 'processedPayments' });

module.exports = {
  User,
  Portfolio,
  Transaction,
  Affiliate,
  AdminWallet,
  Payment
};