'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      
      // Basic Information
      transaction_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      
      // Transaction Details
      type: {
        type: Sequelize.ENUM('deposit', 'withdrawal', 'commission', 'earning', 'bonus', 'penalty', 'refund'),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('manual', 'automatic', 'bot', 'referral', 'admin'),
        defaultValue: 'manual'
      },
      
      // Amount Information
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.ENUM('USD', 'USDT', 'BTC', 'ETH', 'BNB'),
        defaultValue: 'USD'
      },
      exchange_rate: {
        type: Sequelize.DECIMAL(10, 6),
        defaultValue: 1.000000
      },
      
      // Status Information
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'rejected'),
        defaultValue: 'pending'
      },
      
      // Specific Fields (JSON)
      deposit_info: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      withdrawal_info: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      referral_info: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      bot_info: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Processing Information
      processed_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      
      // Additional Information
      description: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      internal_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // Tracking Information
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // Balance Information
      balance_before: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      balance_after: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      
      // Deposit-specific fields
      portfolio_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      investment_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      subscription_fee: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      },
      platform_fee: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      },
      payment_method: {
        type: Sequelize.ENUM('USDT', 'BTC', 'ETH', 'BNB'),
        allowNull: true
      },
      transaction_hash: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      proof_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      rejected_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rejected_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      last_modified_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      last_modified_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      
      // Metadata (JSON)
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Timestamps for different stages
      initiated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      
      // Retry and Error Handling
      retry_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_error: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('transactions', ['user_id', 'created_at']);
    await queryInterface.addIndex('transactions', ['transaction_id']);
    await queryInterface.addIndex('transactions', ['type', 'status']);
    await queryInterface.addIndex('transactions', ['status', 'created_at']);
    await queryInterface.addIndex('transactions', ['processed_by']);
    await queryInterface.addIndex('transactions', ['initiated_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};