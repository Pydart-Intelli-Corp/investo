'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_wallets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      wallet_type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      wallet_address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      qr_code_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      network_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'TRC20'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.addIndex('admin_wallets', ['wallet_type']);
    await queryInterface.addIndex('admin_wallets', ['is_active']);
    await queryInterface.addIndex('admin_wallets', ['created_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_wallets');
  }
};