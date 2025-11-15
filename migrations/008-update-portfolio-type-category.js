const { sequelize } = require('../config/database');

async function updatePortfolioTypeCategory() {
  try {
    console.log('🔄 Updating Portfolio type and category columns...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Drop and recreate type column as VARCHAR
    await sequelize.query(`
      ALTER TABLE portfolios 
      MODIFY COLUMN type VARCHAR(50) NOT NULL DEFAULT 'Basic'
    `);
    console.log('✅ Updated type column to VARCHAR(50)\n');

    // Drop and recreate category column as VARCHAR
    await sequelize.query(`
      ALTER TABLE portfolios 
      MODIFY COLUMN category VARCHAR(50) NOT NULL
    `);
    console.log('✅ Updated category column to VARCHAR(50)\n');

    console.log('🎉 Schema update completed successfully!\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

updatePortfolioTypeCategory();
