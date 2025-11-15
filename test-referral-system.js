const { sequelize } = require('./config/database');
const { User, Affiliate, Transaction, Payment } = require('./models');
const { distributeReferralCommissions } = require('./utils/commissionCalculator');

async function testReferralSystem() {
  console.log('🧪 Starting Comprehensive Referral System Test\n');
  console.log('=' .repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Test 1: Check existing referral chain
    console.log('📋 TEST 1: Analyzing Existing Referral Chains\n');
    console.log('-'.repeat(80));

    const usersWithReferrals = await User.findAll({
      where: { referredBy: { [sequelize.Sequelize.Op.ne]: null } },
      attributes: ['id', 'email', 'firstName', 'lastName', 'referredBy', 'referralCode', 'totalCommissions', 'walletBalance'],
      order: [['id', 'ASC']]
    });

    console.log(`Found ${usersWithReferrals.length} users with referrers:\n`);

    for (const user of usersWithReferrals) {
      const referrer = await User.findByPk(user.referredBy, {
        attributes: ['id', 'firstName', 'lastName', 'email', 'referralCode']
      });

      console.log(`User: ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`  ID: ${user.id} | Code: ${user.referralCode}`);
      console.log(`  Referred by: ${referrer ? `${referrer.firstName} ${referrer.lastName} (ID: ${referrer.id})` : 'Not found'}`);
      console.log(`  Current Balance: $${parseFloat(user.walletBalance).toFixed(2)}`);
      console.log(`  Total Commissions: $${parseFloat(user.totalCommissions || 0).toFixed(2)}`);
      console.log('');
    }

    // Test 2: Build complete referral chains
    console.log('\n📋 TEST 2: Building Complete Referral Chains (5 Levels Deep)\n');
    console.log('-'.repeat(80));

    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'referredBy', 'referralCode'],
      order: [['id', 'ASC']]
    });

    for (const user of allUsers) {
      const chain = [];
      let currentUser = user;
      let level = 0;

      while (currentUser && currentUser.referredBy && level < 5) {
        const referrer = await User.findByPk(currentUser.referredBy, {
          attributes: ['id', 'firstName', 'lastName', 'email', 'referredBy']
        });

        if (referrer) {
          level++;
          chain.push({
            level: level,
            id: referrer.id,
            name: `${referrer.firstName} ${referrer.lastName}`,
            email: referrer.email
          });
          currentUser = referrer;
        } else {
          break;
        }
      }

      if (chain.length > 0) {
        console.log(`\n👤 ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`   Upline Chain (${chain.length} levels):`);
        chain.forEach(ref => {
          console.log(`   Level ${ref.level}: ${ref.name} (ID: ${ref.id}) - ${ref.email}`);
        });
      }
    }

    // Test 3: Check affiliate records
    console.log('\n\n📋 TEST 3: Checking Affiliate Records\n');
    console.log('-'.repeat(80));

    const affiliates = await Affiliate.findAll({
      attributes: [
        'id', 'userId', 'referralCode', 'totalReferrals', 'directReferrals',
        'totalCommissions', 'availableCommissions', 'levelEarnings', 'levelCounts'
      ],
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });

    console.log(`Found ${affiliates.length} affiliate records:\n`);

    affiliates.forEach(affiliate => {
      console.log(`\n${affiliate.user.firstName} ${affiliate.user.lastName} (${affiliate.user.email})`);
      console.log(`  Referral Code: ${affiliate.referralCode}`);
      console.log(`  Direct Referrals: ${affiliate.directReferrals}`);
      console.log(`  Total Referrals: ${affiliate.totalReferrals}`);
      console.log(`  Total Commissions: $${parseFloat(affiliate.totalCommissions || 0).toFixed(2)}`);
      console.log(`  Available Commissions: $${parseFloat(affiliate.availableCommissions || 0).toFixed(2)}`);
      
      if (affiliate.levelEarnings) {
        console.log(`  Level Earnings:`);
        for (let i = 1; i <= 5; i++) {
          const earnings = affiliate.levelEarnings[`level${i}`] || 0;
          if (earnings > 0) {
            console.log(`    Level ${i}: $${parseFloat(earnings).toFixed(2)}`);
          }
        }
      }

      if (affiliate.levelCounts) {
        console.log(`  Level Counts:`);
        for (let i = 1; i <= 5; i++) {
          const count = affiliate.levelCounts[`level${i}`] || 0;
          if (count > 0) {
            console.log(`    Level ${i}: ${count} referrals`);
          }
        }
      }
    });

    // Test 4: Check commission transactions
    console.log('\n\n📋 TEST 4: Checking Commission Transactions\n');
    console.log('-'.repeat(80));

    const commissionTransactions = await Transaction.findAll({
      where: { type: 'commission' },
      attributes: ['id', 'userId', 'amount', 'description', 'status', 'created_at', 'metadata'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit: 20
    });

    if (commissionTransactions.length === 0) {
      console.log('❌ No commission transactions found!\n');
      console.log('This means commissions have not been distributed yet.');
      console.log('Commissions are distributed when admin approves payments.\n');
    } else {
      console.log(`Found ${commissionTransactions.length} commission transactions:\n`);

      commissionTransactions.forEach(tx => {
        console.log(`\n${tx.user.firstName} ${tx.user.lastName} (${tx.user.email})`);
        console.log(`  Amount: $${parseFloat(tx.amount).toFixed(2)}`);
        console.log(`  Description: ${tx.description}`);
        console.log(`  Status: ${tx.status}`);
        console.log(`  Date: ${new Date(tx.created_at).toLocaleString()}`);
        if (tx.metadata) {
          console.log(`  Level: ${tx.metadata.level || 'N/A'}`);
          console.log(`  From: ${tx.metadata.fromUserName || 'N/A'}`);
          console.log(`  Rate: ${tx.metadata.commissionRate || 'N/A'}`);
        }
      });
    }

    // Test 5: Simulate commission distribution
    console.log('\n\n📋 TEST 5: Simulating Commission Distribution\n');
    console.log('-'.repeat(80));

    // Find a user with referrers to test
    const testUser = await User.findOne({
      where: { referredBy: { [sequelize.Sequelize.Op.ne]: null } }
    });

    if (testUser) {
      console.log(`\nSimulating $1000 investment by ${testUser.firstName} ${testUser.lastName}`);
      console.log('This will show what commissions WOULD be distributed:\n');

      const testAmount = 1000;
      let currentUser = testUser;
      let level = 1;
      const commissionRates = { 1: 0.10, 2: 0.05, 3: 0.03, 4: 0.02, 5: 0.01 };
      let totalCommissions = 0;

      while (currentUser && currentUser.referredBy && level <= 5) {
        const referrer = await User.findByPk(currentUser.referredBy, {
          attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'referredBy']
        });

        if (referrer) {
          const rate = commissionRates[level];
          const commission = testAmount * rate;
          totalCommissions += commission;

          console.log(`Level ${level}: ${referrer.firstName} ${referrer.lastName} (${referrer.email})`);
          console.log(`  Rate: ${(rate * 100)}% | Commission: $${commission.toFixed(2)} | Active: ${referrer.isActive ? '✅' : '❌'}`);

          currentUser = referrer;
          level++;
        } else {
          break;
        }
      }

      console.log(`\n💰 Total Commissions to be Distributed: $${totalCommissions.toFixed(2)}`);
      console.log(`📊 Number of Levels: ${level - 1}`);
    } else {
      console.log('⚠️  No users with referrers found for simulation');
    }

    // Test 6: Check payments
    console.log('\n\n📋 TEST 6: Checking Payment Records\n');
    console.log('-'.repeat(80));

    const payments = await Payment.findAll({
      attributes: ['id', 'userId', 'amount', 'status', 'created_at'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    if (payments.length === 0) {
      console.log('❌ No payments found in the system\n');
    } else {
      console.log(`Found ${payments.length} recent payments:\n`);

      const statusCounts = {
        PENDING: 0,
        COMPLETED: 0,
        REJECTED: 0,
        PROCESSING: 0
      };

      payments.forEach(payment => {
        statusCounts[payment.status] = (statusCounts[payment.status] || 0) + 1;
        console.log(`${payment.user.firstName} ${payment.user.lastName} - $${parseFloat(payment.amount).toFixed(2)} - ${payment.status}`);
      });

      console.log(`\nPayment Status Summary:`);
      Object.entries(statusCounts).forEach(([status, count]) => {
        if (count > 0) {
          console.log(`  ${status}: ${count}`);
        }
      });

      const completedPayments = payments.filter(p => p.status === 'COMPLETED');
      if (completedPayments.length > 0) {
        console.log(`\n✅ ${completedPayments.length} completed payments (commissions should have been distributed)`);
      } else {
        console.log(`\n⚠️  No completed payments yet (commissions will be distributed when admin approves)`);
      }
    }

    // Summary
    console.log('\n\n');
    console.log('='.repeat(80));
    console.log('📊 REFERRAL SYSTEM TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Total Users: ${allUsers.length}`);
    console.log(`✅ Users with Referrers: ${usersWithReferrals.length}`);
    console.log(`✅ Affiliate Records: ${affiliates.length}`);
    console.log(`✅ Commission Transactions: ${commissionTransactions.length}`);
    console.log(`✅ Total Payments: ${payments.length}`);
    
    if (commissionTransactions.length === 0 && payments.filter(p => p.status === 'COMPLETED').length > 0) {
      console.log('\n⚠️  WARNING: You have completed payments but no commission transactions!');
      console.log('   This means the commission system was not active when payments were approved.');
      console.log('   New payments will distribute commissions correctly.');
    } else if (commissionTransactions.length > 0) {
      console.log('\n✅ Commission system is working! Transactions found.');
    }

    console.log('\n💡 NEXT STEPS:');
    console.log('1. Have users register with referral codes');
    console.log('2. Users make payments');
    console.log('3. Admin approves payments');
    console.log('4. Commissions automatically distribute to 5 levels');
    console.log('5. Check dashboard for updated balances and commissions');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testReferralSystem();
