const { sequelize } = require('./config/database');
const { Portfolio } = require('./models');

async function checkPortfolios() {
  try {
    console.log('🔍 Checking portfolios in database...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');

    const portfolios = await Portfolio.findAll({
      attributes: ['id', 'name', 'type', 'category', 'isActive', 'isVisible', 'minInvestment', 'maxInvestment', 'dailyROI', 'displayOrder'],
      order: [['type', 'ASC'], ['displayOrder', 'ASC']]
    });

    console.log(`=== Total Portfolios Found: ${portfolios.length} ===\n`);

    if (portfolios.length === 0) {
      console.log('❌ NO PORTFOLIOS FOUND IN DATABASE!');
      console.log('\n💡 You need to run the seed script:');
      console.log('   node scripts/seed-portfolios.js\n');
    } else {
      console.log('📊 Portfolio Details:\n');
      portfolios.forEach((p, index) => {
        console.log(`${index + 1}. ${p.name}`);
        console.log(`   Type: ${p.type} | Category: ${p.category}`);
        console.log(`   Active: ${p.isActive ? '✅' : '❌'} | Visible: ${p.isVisible ? '✅' : '❌'}`);
        console.log(`   Investment Range: $${p.minInvestment} - $${p.maxInvestment}`);
        console.log(`   Daily ROI: ${p.dailyROI}%`);
        console.log(`   Display Order: ${p.displayOrder}`);
        console.log('');
      });

      // Check for active and visible portfolios
      const activeVisible = portfolios.filter(p => p.isActive && p.isVisible);
      console.log(`\n✅ Active & Visible Portfolios: ${activeVisible.length}`);
      
      if (activeVisible.length === 0) {
        console.log('⚠️  WARNING: No portfolios are both active AND visible!');
        console.log('   The API endpoint requires isActive=true AND isVisible=true\n');
      }
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking portfolios:', error);
    process.exit(1);
  }
}

checkPortfolios();
