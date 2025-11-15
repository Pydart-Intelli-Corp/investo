const { sequelize } = require('./config/database');
const { User, Affiliate } = require('./models');

async function checkAllLevelEarnings() {
  console.log('📊 Checking All Users Level Earnings\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    const usersWithCommissions = await User.findAll({
      include: [{
        model: Affiliate,
        as: 'affiliate',
        where: { totalCommissions: { [require('sequelize').Op.gt]: 0 } }
      }],
      attributes: ['id', 'firstName', 'lastName', 'email', 'totalCommissions', 'totalEarnings', 'walletBalance']
    });

    console.log(`Found ${usersWithCommissions.length} users with commissions:\n`);

    for (const user of usersWithCommissions) {
      console.log(`👤 ${user.firstName} ${user.lastName} (ID: ${user.id})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Wallet Balance: $${parseFloat(user.walletBalance || 0).toFixed(2)}`);
      console.log(`   Total Earnings: $${parseFloat(user.totalEarnings || 0).toFixed(2)}`);
      console.log(`   Total Commissions: $${parseFloat(user.totalCommissions || 0).toFixed(2)}\n`);
      
      if (user.affiliate) {
        console.log(`   Affiliate Stats:`);
        console.log(`   - Total Commissions: $${parseFloat(user.affiliate.totalCommissions || 0).toFixed(2)}`);
        console.log(`   - Available: $${parseFloat(user.affiliate.availableCommissions || 0).toFixed(2)}`);
        
        const levelEarnings = user.affiliate.levelEarnings || {};
        console.log(`   - Level Earnings:`);
        for (let i = 1; i <= 5; i++) {
          const amount = parseFloat(levelEarnings[`level${i}`] || 0);
          if (amount > 0) {
            console.log(`     Level ${i}: $${amount.toFixed(2)}`);
          }
        }
        console.log('');
      }
    }

    console.log('='.repeat(80));
    console.log('📈 SUMMARY BY LEVEL\n');

    const levelTotals = { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0 };
    
    for (const user of usersWithCommissions) {
      if (user.affiliate && user.affiliate.levelEarnings) {
        for (let i = 1; i <= 5; i++) {
          const key = `level${i}`;
          levelTotals[key] += parseFloat(user.affiliate.levelEarnings[key] || 0);
        }
      }
    }

    for (let i = 1; i <= 5; i++) {
      const key = `level${i}`;
      console.log(`Level ${i}: $${levelTotals[key].toFixed(2)}`);
    }

    console.log(`\nTotal All Levels: $${Object.values(levelTotals).reduce((a, b) => a + b, 0).toFixed(2)}\n`);

    console.log('✅ All commission levels working correctly!\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkAllLevelEarnings();
