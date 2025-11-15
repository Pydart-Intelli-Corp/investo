const { sequelize } = require('./config/database');
const { Payment, Portfolio } = require('./models');

async function fixOrphanedPayments() {
  try {
    console.log('🔧 Fixing orphaned payment records...\n');
    
    await sequelize.authenticate();

    // Find all payments with non-existent portfolio IDs
    const allPayments = await Payment.findAll();
    
    let orphanedCount = 0;
    let fixedCount = 0;

    for (const payment of allPayments) {
      const portfolio = await Portfolio.findByPk(payment.portfolioId);
      
      if (!portfolio) {
        orphanedCount++;
        console.log(`Found orphaned payment ID ${payment.id} with portfolio ID ${payment.portfolioId}`);
        
        // Get the first available portfolio as default
        const defaultPortfolio = await Portfolio.findOne({
          where: { isActive: true, isVisible: true },
          order: [['displayOrder', 'ASC']]
        });

        if (defaultPortfolio) {
          // Update the payment to use the default portfolio
          await payment.update({ portfolioId: defaultPortfolio.id });
          console.log(`✅ Updated payment ${payment.id} to use portfolio: ${defaultPortfolio.name} (ID: ${defaultPortfolio.id})`);
          fixedCount++;
        } else {
          console.log(`⚠️  No default portfolio found. Consider deleting payment ${payment.id}`);
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  - Total payments checked: ${allPayments.length}`);
    console.log(`  - Orphaned payments found: ${orphanedCount}`);
    console.log(`  - Payments fixed: ${fixedCount}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixOrphanedPayments();
