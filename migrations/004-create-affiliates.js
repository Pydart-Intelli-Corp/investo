'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('affiliates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      
      // User Information
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      
      // Referral Information
      referral_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      referral_link: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      
      // Referral Statistics
      total_referrals: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      active_referrals: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      direct_referrals: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      
      // Level-wise Referral Counts (JSON)
      level_counts: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Commission Statistics
      total_commissions: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      available_commissions: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      withdrawn_commissions: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      pending_commissions: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00
      },
      
      // Level-wise Commission Earnings (JSON)
      level_earnings: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Team Statistics (JSON)
      team_stats: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Performance Metrics (JSON)
      performance_metrics: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Tracking and Analytics (JSON)
      click_stats: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Commission Settings (JSON)
      commission_settings: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Achievements and Milestones (JSON)
      achievements: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Marketing Tools (JSON)
      marketing_tools: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Status and Settings
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_premium_affiliate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      tier: {
        type: Sequelize.ENUM('Bronze', 'Silver', 'Gold', 'Diamond'),
        defaultValue: 'Bronze'
      },
      
      // Payout Settings (JSON)
      payout_settings: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      
      // Important Dates
      first_referral_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_commission_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      tier_updated_at: {
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
    await queryInterface.addIndex('affiliates', ['user_id']);
    await queryInterface.addIndex('affiliates', ['referral_code']);
    await queryInterface.addIndex('affiliates', ['tier']);
    await queryInterface.addIndex('affiliates', ['is_active']);
    await queryInterface.addIndex('affiliates', ['total_commissions']);
    await queryInterface.addIndex('affiliates', ['total_referrals']);
    await queryInterface.addIndex('affiliates', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('affiliates');
  }
};