const { sequelize } = require('./config/database');
const { User, Affiliate } = require('./models');

async function checkUserEarnings() {
  console.log('💰 Checking User Earnings and Commissions\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find user with ID 16 (the one who received commission)
    const user = await User.findByPk(16, {
      include: [{
        model: Affiliate,
        as: 'affiliate'
      }]
    });

    if (!user) {
      console.log('User ID 16 not found');
      await sequelize.close();
      process.exit(0);
    }

    console.log(`👤 User: ${user.firstName} ${user.lastName}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`\n💰 Financial Details:`);
    console.log(`   Wallet Balance: $${parseFloat(user.walletBalance || 0).toFixed(2)}`);
    console.log(`   Total Earnings: $${parseFloat(user.totalEarnings || 0).toFixed(2)}`);
    console.log(`   Total Commissions: $${parseFloat(user.totalCommissions || 0).toFixed(2)}`);
    console.log(`   Total Deposited: $${parseFloat(user.totalDeposited || 0).toFixed(2)}`);

    if (user.affiliate) {
      console.log(`\n📊 Affiliate Details:`);
      console.log(`   Total Commissions: $${parseFloat(user.affiliate.totalCommissions || 0).toFixed(2)}`);
      console.log(`   Available Commissions: $${parseFloat(user.affiliate.availableCommissions || 0).toFixed(2)}`);
      console.log(`   Withdrawn Commissions: $${parseFloat(user.affiliate.withdrawnCommissions || 0).toFixed(2)}`);
      console.log(`   Direct Referrals: ${user.affiliate.directReferrals}`);
      console.log(`   Total Referrals: ${user.affiliate.totalReferrals}`);
      
      if (user.affiliate.levelEarnings) {
        console.log(`\n📈 Level Earnings:`);
        const levelEarnings = user.affiliate.levelEarnings;
        for (let i = 1; i <= 5; i++) {
          const key = `level${i}`;
          const amount = parseFloat(levelEarnings[key] || 0);
          if (amount > 0) {
            console.log(`   Level ${i}: $${amount.toFixed(2)}`);
          }
        }
      }
    }

    console.log('\n✅ Check complete!');
    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkUserEarnings();
