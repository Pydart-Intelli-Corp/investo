const { sequelize } = require('./config/database');
const { QueryInterface } = require('sequelize');

async function runAdminWalletMigration() {
  try {
    console.log('Starting admin wallet seeding...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');
    
    // Check if admin_wallets table exists
    const queryInterface = sequelize.getQueryInterface();
    
    // Create admin_wallets table if it doesn't exist
    await queryInterface.createTable('admin_wallets', {
      id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      wallet_type: {
        type: sequelize.Sequelize.ENUM('USDT', 'BTC', 'ETH', 'BNB'),
        allowNull: false,
        unique: true
      },
      wallet_address: {
        type: sequelize.Sequelize.STRING(255),
        allowNull: false
      },
      qr_code_url: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      },
      network: {
        type: sequelize.Sequelize.STRING(50),
        allowNull: true
      },
      is_active: {
        type: sequelize.Sequelize.BOOLEAN,
        defaultValue: true
      },
      min_deposit: {
        type: sequelize.Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      max_deposit: {
        type: sequelize.Sequelize.DECIMAL(15, 2),
        defaultValue: 100000
      },
      display_order: {
        type: sequelize.Sequelize.INTEGER,
        defaultValue: 0
      },
      metadata: {
        type: sequelize.Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: sequelize.Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.NOW
      },
      updated_at: {
        type: sequelize.Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.NOW
      }
    });
    
    console.log('✓ Admin wallets table created or verified.');
    
    // Check if records already exist
    const existingWallets = await sequelize.query(
      'SELECT COUNT(*) as count FROM admin_wallets',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (existingWallets[0].count > 0) {
      console.log('Admin wallets already exist. Skipping seeding.');
      return;
    }
    
    // Insert sample admin wallets
    const adminWallets = [
      {
        wallet_type: 'USDT',
        wallet_address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5oahh7j',
        qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TQn9Y2khEsLJW1ChVWFMSMeRDow5oahh7j',
        network: 'TRC20',
        is_active: true,
        min_deposit: 10.00,
        max_deposit: 50000.00,
        display_order: 1,
        metadata: JSON.stringify({
          description: 'USDT (Tether) - TRC20 Network',
          confirmations_required: 1,
          processing_time: '5-10 minutes'
        })
      },
      {
        wallet_type: 'BTC',
        wallet_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        network: 'Bitcoin',
        is_active: true,
        min_deposit: 0.001,
        max_deposit: 10.00,
        display_order: 2,
        metadata: JSON.stringify({
          description: 'Bitcoin - Native Network',
          confirmations_required: 3,
          processing_time: '30-60 minutes'
        })
      },
      {
        wallet_type: 'ETH',
        wallet_address: '0x742d35Cc4bcf4fF9e66ba59e4a6E9f4d2D0Fd4',
        qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc4bcf4fF9e66ba59e4a6E9f4d2D0Fd4',
        network: 'ERC20',
        is_active: true,
        min_deposit: 0.01,
        max_deposit: 100.00,
        display_order: 3,
        metadata: JSON.stringify({
          description: 'Ethereum - ERC20 Network',
          confirmations_required: 12,
          processing_time: '10-20 minutes'
        })
      }
    ];
    
    await queryInterface.bulkInsert('admin_wallets', adminWallets);
    console.log('✓ Admin wallets seeded successfully.');
    
    // Verify the data
    const walletCount = await sequelize.query(
      'SELECT COUNT(*) as count FROM admin_wallets',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log(`✓ Total admin wallets in database: ${walletCount[0].count}`);
    
    // Show the wallets
    const wallets = await sequelize.query(
      'SELECT wallet_type, wallet_address, network, is_active FROM admin_wallets ORDER BY display_order',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('✓ Admin wallets:');
    wallets.forEach(wallet => {
      console.log(`  - ${wallet.wallet_type} (${wallet.network}): ${wallet.wallet_address} - Active: ${wallet.is_active}`);
    });
    
    console.log('🎉 Admin wallet migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the migration
runAdminWalletMigration();