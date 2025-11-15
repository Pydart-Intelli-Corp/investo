const { sequelize } = require('./config/database');
const { Portfolio } = require('./models');

async function clearPortfolios() {
  try {
    console.log('🗑️  Clearing all portfolios from database...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    const count = await Portfolio.count();
    console.log(`Found ${count} portfolios to delete\n`);

    if (count > 0) {
      await Portfolio.destroy({ where: {}, truncate: false });
      console.log('✅ All portfolios deleted successfully\n');
    } else {
      console.log('ℹ️  No portfolios found to delete\n');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearPortfolios();
