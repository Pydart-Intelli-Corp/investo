const { sequelize } = require('./config/database');
const { User, Payment, Affiliate, Transaction } = require('./models');

async function checkRecentCommission() {
  console.log('🔍 Checking Recent Commission Distribution\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find the most recent payment (ID: 12)
    console.log('Step 1: Checking Payment ID 12');
    const payment = await Payment.findByPk(12, {
      include: [
        { model: User, as: 'user' }
      ]
    });

    if (!payment) {
      console.log('❌ Payment 12 not found');
      await sequelize.close();
      process.exit(1);
    }

    console.log(`✅ Payment Details:`);
    console.log(`   ID: ${payment.id}`);
    console.log(`   Amount: $${parseFloat(payment.amount).toFixed(2)}`);
    console.log(`   Status: ${payment.status}`);
    console.log(`   User: ${payment.user.firstName} ${payment.user.lastName} (ID: ${payment.userId})`);
    console.log(`   Referred By: ${payment.user.referredBy || 'None'}`);

    if (!payment.user.referredBy) {
      console.log('\n⚠️  USER HAS NO REFERRER! Cannot distribute commissions.\n');
      await sequelize.close();
      process.exit(0);
    }

    // Check the referrer
    console.log(`\nStep 2: Checking Referrer (ID: ${payment.user.referredBy})`);
    const referrer = await User.findByPk(payment.user.referredBy, {
      include: [{ model: Affiliate, as: 'affiliate' }]
    });

    console.log(`✅ Referrer: ${referrer.firstName} ${referrer.lastName}`);
    console.log(`   Email: ${referrer.email}`);
    console.log(`   Wallet Balance: $${parseFloat(referrer.walletBalance || 0).toFixed(2)}`);
    console.log(`   Total Earnings: $${parseFloat(referrer.totalEarnings || 0).toFixed(2)}`);
    console.log(`   Total Commissions: $${parseFloat(referrer.totalCommissions || 0).toFixed(2)}`);

    if (referrer.affiliate) {
      console.log(`\nAffiliate Stats:`);
      console.log(`   Total Commissions: $${parseFloat(referrer.affiliate.totalCommissions || 0).toFixed(2)}`);
      console.log(`   Available Commissions: $${parseFloat(referrer.affiliate.availableCommissions || 0).toFixed(2)}`);
    }

    // Check commission transactions
    console.log(`\nStep 3: Checking Commission Transactions for Payment 12`);
    const commissions = await Transaction.findAll({
      where: {
        type: 'commission',
        userId: referrer.id
      },
      order: [['created_at', 'DESC']],
      limit: 5
    });

    console.log(`Found ${commissions.length} recent commission transactions:\n`);
    
    let foundForThisPayment = false;
    for (const comm of commissions) {
      const isForThisPayment = comm.referralInfo && comm.referralInfo.fromUserId === payment.userId;
      console.log(`   ${isForThisPayment ? '✅' : '  '} $${parseFloat(comm.amount).toFixed(2)} - ${comm.description}`);
      console.log(`      Status: ${comm.status}`);
      if (comm.referralInfo) {
        console.log(`      From User: ${comm.referralInfo.fromUserId} | Level: ${comm.referralInfo.level}`);
      }
      console.log(`      Created: ${comm.created_at}`);
      console.log('');
      
      if (isForThisPayment) foundForThisPayment = true;
    }

    if (!foundForThisPayment) {
      console.log('⚠️  NO COMMISSION FOUND FOR THIS PAYMENT!\n');
    }

    // Check all transactions for the new user
    console.log(`Step 4: All Recent Transactions`);
    const allTransactions = await Transaction.findAll({
      where: {
        type: 'commission'
      },
      order: [['created_at', 'DESC']],
      limit: 10
    });

    console.log(`\nAll Recent Commission Transactions (Last 10):\n`);
    for (const tx of allTransactions) {
      console.log(`   User ID: ${tx.userId} | $${parseFloat(tx.amount).toFixed(2)} | ${tx.status}`);
      console.log(`   ${tx.description}`);
      console.log(`   Created: ${tx.created_at}\n`);
    }

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkRecentCommission();
