const { sequelize } = require('./config/database');
const { User, Affiliate } = require('./models');

async function checkDashboardData() {
  console.log('📊 Checking Dashboard Data for Referrer\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check user 20 (the referrer)
    const userId = 20;
    const user = await User.findByPk(userId, {
      include: [{
        model: Affiliate,
        as: 'affiliate'
      }],
      attributes: [
        'id', 'firstName', 'lastName', 'email', 
        'walletBalance', 'totalEarnings', 'totalCommissions',
        'totalDeposited', 'totalWithdrawn'
      ]
    });

    if (!user) {
      console.log('User not found');
      await sequelize.close();
      process.exit(1);
    }

    console.log('👤 USER DATA (as sent to dashboard):\n');
    console.log(JSON.stringify({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      walletBalance: parseFloat(user.walletBalance || 0).toFixed(2),
      totalEarnings: parseFloat(user.totalEarnings || 0).toFixed(2),
      totalCommissions: parseFloat(user.totalCommissions || 0).toFixed(2),
      totalDeposited: parseFloat(user.totalDeposited || 0).toFixed(2),
      totalWithdrawn: parseFloat(user.totalWithdrawn || 0).toFixed(2)
    }, null, 2));

    if (user.affiliate) {
      console.log('\n\n📊 AFFILIATE DATA (as sent to dashboard):\n');
      console.log(JSON.stringify({
        totalCommissions: parseFloat(user.affiliate.totalCommissions || 0).toFixed(2),
        availableCommissions: parseFloat(user.affiliate.availableCommissions || 0).toFixed(2),
        withdrawnCommissions: parseFloat(user.affiliate.withdrawnCommissions || 0).toFixed(2),
        pendingCommissions: parseFloat(user.affiliate.pendingCommissions || 0).toFixed(2),
        levelEarnings: user.affiliate.levelEarnings,
        totalReferrals: user.affiliate.totalReferrals,
        directReferrals: user.affiliate.directReferrals,
        activeReferrals: user.affiliate.activeReferrals
      }, null, 2));
    } else {
      console.log('\n⚠️  NO AFFILIATE RECORD FOUND!\n');
    }

    console.log('\n\n' + '='.repeat(80));
    console.log('💡 Dashboard Should Display:\n');
    console.log(`   Wallet Balance: $${parseFloat(user.walletBalance || 0).toFixed(2)}`);
    console.log(`   Total Earnings: $${parseFloat(user.totalEarnings || 0).toFixed(2)}`);
    console.log(`   Total Commissions: $${parseFloat(user.totalCommissions || 0).toFixed(2)}`);
    
    if (user.affiliate) {
      console.log(`\n   Affiliate Total Commissions: $${parseFloat(user.affiliate.totalCommissions || 0).toFixed(2)}`);
      console.log(`   Available to Withdraw: $${parseFloat(user.affiliate.availableCommissions || 0).toFixed(2)}`);
    }

    console.log('\n\n💡 TROUBLESHOOTING:\n');
    console.log('1. Login as: official.tishnu@gmail.com');
    console.log('2. Go to Dashboard');
    console.log('3. Check these boxes:');
    console.log(`   - Wallet Balance should show: $${parseFloat(user.walletBalance || 0).toFixed(2)}`);
    console.log(`   - Total Earnings should show: $${parseFloat(user.totalEarnings || 0).toFixed(2)}`);
    console.log(`   - Total Commissions should show: $${parseFloat(user.totalCommissions || 0).toFixed(2)}`);
    console.log('\n4. If not showing, try:');
    console.log('   - Hard refresh (Ctrl+Shift+R)');
    console.log('   - Clear browser cache');
    console.log('   - Logout and login again\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkDashboardData();
