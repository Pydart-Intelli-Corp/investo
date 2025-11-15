const { sequelize } = require('./config/database');
const { User, Payment, Affiliate, Transaction } = require('./models');

async function testReferralRegistrationAndPayment() {
  console.log('🧪 Testing Referral Registration and Payment Flow\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Step 1: Find the referrer by referral code
    const referralCode = 'REFJMZ8B3Y3';
    console.log(`Step 1: Looking up referral code: ${referralCode}`);
    
    const referrerAffiliate = await Affiliate.findOne({
      where: { referralCode: referralCode },
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!referrerAffiliate) {
      console.log(`❌ Referral code ${referralCode} not found!`);
      await sequelize.close();
      process.exit(1);
    }

    const referrer = referrerAffiliate.user;
    console.log(`✅ Found referrer: ${referrer.firstName} ${referrer.lastName} (ID: ${referrer.id})`);
    console.log(`   Email: ${referrer.email}`);
    console.log(`   Current Balance: $${parseFloat(referrer.walletBalance || 0).toFixed(2)}`);
    console.log(`   Current Total Earnings: $${parseFloat(referrer.totalEarnings || 0).toFixed(2)}`);
    console.log(`   Current Total Commissions: $${parseFloat(referrer.totalCommissions || 0).toFixed(2)}`);

    // Step 2: Check if there are any users referred by this referrer
    console.log(`\nStep 2: Checking users referred by ${referrer.firstName}`);
    
    const referredUsers = await User.findAll({
      where: { referredBy: referrer.id },
      order: [['created_at', 'DESC']],
      limit: 5
    });

    console.log(`✅ Found ${referredUsers.length} referred users:`);
    for (const user of referredUsers) {
      console.log(`   - ${user.firstName} ${user.lastName} (ID: ${user.id}) - ${user.email}`);
      console.log(`     Registered: ${user.createdAt}`);
      
      // Check their payments
      const payments = await Payment.findAll({
        where: { userId: user.id },
        order: [['created_at', 'DESC']]
      });
      
      console.log(`     Payments: ${payments.length}`);
      for (const payment of payments) {
        console.log(`       * $${parseFloat(payment.amount).toFixed(2)} - ${payment.status} (ID: ${payment.id})`);
      }
    }

    // Step 3: Check all commission transactions for the referrer
    console.log(`\nStep 3: Checking commission transactions for ${referrer.firstName}`);
    
    const commissionTransactions = await Transaction.findAll({
      where: {
        userId: referrer.id,
        type: 'commission'
      },
      order: [['created_at', 'DESC']]
    });

    console.log(`✅ Found ${commissionTransactions.length} commission transactions:`);
    for (const tx of commissionTransactions) {
      console.log(`   - $${parseFloat(tx.amount).toFixed(2)} - ${tx.description}`);
      console.log(`     Status: ${tx.status} | Date: ${tx.createdAt}`);
      if (tx.referralInfo) {
        console.log(`     From User ID: ${tx.referralInfo.fromUserId} | Level: ${tx.referralInfo.level}`);
      }
    }

    // Step 4: Check affiliate stats
    console.log(`\nStep 4: Current Affiliate Stats for ${referrer.firstName}`);
    console.log(`   Total Referrals: ${referrerAffiliate.totalReferrals}`);
    console.log(`   Direct Referrals: ${referrerAffiliate.directReferrals}`);
    console.log(`   Total Commissions: $${parseFloat(referrerAffiliate.totalCommissions || 0).toFixed(2)}`);
    console.log(`   Available Commissions: $${parseFloat(referrerAffiliate.availableCommissions || 0).toFixed(2)}`);
    
    if (referrerAffiliate.levelEarnings) {
      console.log(`   Level Earnings:`);
      const levelEarnings = referrerAffiliate.levelEarnings;
      for (let i = 1; i <= 5; i++) {
        const key = `level${i}`;
        const amount = parseFloat(levelEarnings[key] || 0);
        if (amount > 0) {
          console.log(`     Level ${i}: $${amount.toFixed(2)}`);
        }
      }
    }

    // Step 5: Simulation - What would happen if a new user registers and makes payment
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 SIMULATION: New User Registration & Payment Flow\n');
    console.log('Scenario: New user registers with referral code REFJMZ8B3Y3');
    console.log('          New user makes $1000 payment');
    console.log('          Admin approves payment\n');
    console.log('Expected Commission Distribution:');
    console.log(`   Level 1 (10%): ${referrer.firstName} gets $100.00`);
    
    if (referrer.referredBy) {
      const level2Referrer = await User.findByPk(referrer.referredBy);
      if (level2Referrer) {
        console.log(`   Level 2 (5%): ${level2Referrer.firstName} gets $50.00`);
      }
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log('💡 INSTRUCTIONS TO TEST:\n');
    console.log('1. Open browser: http://192.168.1.33:5000/register?ref=REFJMZ8B3Y3');
    console.log('2. Register a new test user');
    console.log('3. Login with the new user');
    console.log('4. Select an investment plan');
    console.log('5. Submit payment with screenshot');
    console.log('6. Login as admin');
    console.log('7. Approve the payment');
    console.log('8. Check commission distribution automatically happens');
    console.log(`9. Verify ${referrer.firstName}'s dashboard shows updated commissions\n`);

    console.log('✅ Test analysis complete!');
    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testReferralRegistrationAndPayment();
