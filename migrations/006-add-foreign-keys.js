'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add foreign key constraint for users.referred_by -> users.id
    await queryInterface.addConstraint('users', {
      fields: ['referred_by'],
      type: 'foreign key',
      name: 'fk_users_referred_by',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for users.active_subscription -> portfolios.id
    await queryInterface.addConstraint('users', {
      fields: ['active_subscription'],
      type: 'foreign key',
      name: 'fk_users_active_subscription',
      references: {
        table: 'portfolios',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for portfolios.created_by -> users.id
    await queryInterface.addConstraint('portfolios', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_portfolios_created_by',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for portfolios.last_modified_by -> users.id
    await queryInterface.addConstraint('portfolios', {
      fields: ['last_modified_by'],
      type: 'foreign key',
      name: 'fk_portfolios_last_modified_by',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for transactions.user_id -> users.id
    await queryInterface.addConstraint('transactions', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_transactions_user_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for transactions.portfolio_id -> portfolios.id
    await queryInterface.addConstraint('transactions', {
      fields: ['portfolio_id'],
      type: 'foreign key',
      name: 'fk_transactions_portfolio_id',
      references: {
        table: 'portfolios',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for transactions.processed_by -> users.id
    await queryInterface.addConstraint('transactions', {
      fields: ['processed_by'],
      type: 'foreign key',
      name: 'fk_transactions_processed_by',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for transactions.approved_by -> users.id
    await queryInterface.addConstraint('transactions', {
      fields: ['approved_by'],
      type: 'foreign key',
      name: 'fk_transactions_approved_by',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for transactions.rejected_by -> users.id
    await queryInterface.addConstraint('transactions', {
      fields: ['rejected_by'],
      type: 'foreign key',
      name: 'fk_transactions_rejected_by',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for transactions.last_modified_by -> users.id
    await queryInterface.addConstraint('transactions', {
      fields: ['last_modified_by'],
      type: 'foreign key',
      name: 'fk_transactions_last_modified_by',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add foreign key constraint for affiliates.user_id -> users.id
    await queryInterface.addConstraint('affiliates', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_affiliates_user_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all foreign key constraints
    await queryInterface.removeConstraint('users', 'fk_users_referred_by');
    await queryInterface.removeConstraint('users', 'fk_users_active_subscription');
    await queryInterface.removeConstraint('portfolios', 'fk_portfolios_created_by');
    await queryInterface.removeConstraint('portfolios', 'fk_portfolios_last_modified_by');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_user_id');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_portfolio_id');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_processed_by');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_approved_by');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_rejected_by');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_last_modified_by');
    await queryInterface.removeConstraint('affiliates', 'fk_affiliates_user_id');
  }
};