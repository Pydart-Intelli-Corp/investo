const { sequelize } = require('../config/database');
const { User, Portfolio, Transaction, Affiliate, Payment, AdminWallet } = require('../models');
const logger = require('../utils/logger');

async function syncModels() {
  try {
    console.log('Starting model synchronization...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');
    
    // Sync all models
    console.log('Synchronizing database models...');
    
    // Sync models in dependency order
    await AdminWallet.sync({ alter: true });
    console.log('✓ AdminWallet model synchronized');
    
    await Payment.sync({ alter: true });
    console.log('✓ Payment model synchronized');
    
    await sequelize.sync({ alter: true });
    console.log('✓ All models synchronized');
    
    console.log('🎉 Model synchronization completed successfully!');
    
  } catch (error) {
    console.error('❌ Model synchronization failed:', error);
    logger.error('Model sync error:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the sync
syncModels();