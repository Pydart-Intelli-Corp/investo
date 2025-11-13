const { DataTypes } = require('sequelize');

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('payments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    portfolio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'portfolios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    subscription_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 25.00
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    payment_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'USDT'
    },
    network_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'BEP20'
    },
    admin_wallet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_wallets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    payment_screenshot: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    screenshot_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    transaction_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    processed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  // Add indexes for better performance
  await queryInterface.addIndex('payments', ['user_id'], {
    name: 'idx_payments_user_id'
  });

  await queryInterface.addIndex('payments', ['portfolio_id'], {
    name: 'idx_payments_portfolio_id'
  });

  await queryInterface.addIndex('payments', ['status'], {
    name: 'idx_payments_status'
  });

  await queryInterface.addIndex('payments', ['created_at'], {
    name: 'idx_payments_created_at'
  });

  await queryInterface.addIndex('payments', ['admin_wallet_id'], {
    name: 'idx_payments_admin_wallet_id'
  });
}

async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('payments');
}

module.exports = { up, down };