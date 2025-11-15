const { sequelize } = require('./config/database');
const { Payment, User, Portfolio, AdminWallet } = require('./models');

async function checkPaymentPortfolios() {
  try {
    console.log('🔍 Checking payment portfolios...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get all payments with portfolio associations
    const payments = await Payment.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'type'],
          required: false // Allow null portfolios
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 20
    });

    console.log(`Total payments found: ${payments.length}\n`);

    // Check for null portfolios
    const paymentsWithNullPortfolio = payments.filter(p => !p.portfolio);
    
    if (paymentsWithNullPortfolio.length > 0) {
      console.log(`⚠️  Found ${paymentsWithNullPortfolio.length} payments with NULL portfolio:\n`);
      
      paymentsWithNullPortfolio.forEach(payment => {
        console.log(`Payment ID: ${payment.id}`);
        console.log(`  User: ${payment.user.firstName} ${payment.user.lastName} (${payment.user.email})`);
        console.log(`  Amount: $${payment.amount}`);
        console.log(`  Portfolio ID: ${payment.portfolioId}`);
        console.log(`  Status: ${payment.status}`);
        console.log(`  Created: ${payment.createdAt}`);
        console.log('');
      });

      // Check if portfolio IDs exist in portfolios table
      console.log('Checking if portfolio IDs exist in database...\n');
      for (const payment of paymentsWithNullPortfolio) {
        const portfolio = await Portfolio.findByPk(payment.portfolioId);
        if (!portfolio) {
          console.log(`❌ Portfolio ID ${payment.portfolioId} does NOT exist in database (Payment ${payment.id})`);
        } else {
          console.log(`✅ Portfolio ID ${payment.portfolioId} exists: ${portfolio.name}`);
        }
      }
    } else {
      console.log('✅ All payments have valid portfolio associations');
    }

    // Show sample of valid payments
    const validPayments = payments.filter(p => p.portfolio);
    if (validPayments.length > 0) {
      console.log(`\n✅ Sample valid payments (${validPayments.length}):\n`);
      validPayments.slice(0, 5).forEach(payment => {
        console.log(`Payment ID: ${payment.id} | User: ${payment.user.firstName} | Portfolio: ${payment.portfolio.name} | Amount: $${payment.amount}`);
      });
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPaymentPortfolios();
