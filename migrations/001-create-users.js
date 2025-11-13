'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      
      // Basic Information
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      
      // Profile Information
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      
      // Wallet Information
      wallet_address: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      wallet_qr_code: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      qr_code_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
      // Account Status
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_profile_complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      role: {
        type: Sequelize.ENUM('user', 'admin', 'superadmin'),
        defaultValue: 'user'
      },
      
      // Referral System
      referral_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      referred_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      referral_level: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_referrals: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      direct_referrals: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      
      // Financial Information
      wallet_balance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      total_withdrawn: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      total_earnings: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      total_commissions: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      
      // Rank System
      current_rank: {
        type: Sequelize.ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'),
        defaultValue: 'Bronze'
      },
      rank_updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      
      // Subscription Information
      active_subscription: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      subscription_status: {
        type: Sequelize.ENUM('none', 'pending', 'active', 'expired', 'cancelled'),
        defaultValue: 'none'
      },
      subscription_start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      subscription_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      
      // Bot Status
      bot_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      bot_activated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      daily_roi: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00
      },
      
      // Security
      password_reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      password_reset_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      email_verification_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      email_verification_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      email_verification_otp: {
        type: Sequelize.STRING(6),
        allowNull: true
      },
      otp_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      otp_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      login_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lock_until: {
        type: Sequelize.DATE,
        allowNull: true
      },
      
      // Timestamps
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_activity: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['referral_code']);
    await queryInterface.addIndex('users', ['referred_by']);
    await queryInterface.addIndex('users', ['current_rank']);
    await queryInterface.addIndex('users', ['is_active']);
    await queryInterface.addIndex('users', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};