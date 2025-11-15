const { sequelize } = require('./config/database');
const { User, Payment, Portfolio } = require('./models');
const { distributeReferralCommissions } = require('./utils/commissionCalculator');

async function testPaymentApproval() {
  console.log('🧪 Testing Payment Approval with Commission Distribution\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find a pending payment
    const pendingPayment = await Payment.findOne({
      where: { status: 'PENDING' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'walletBalance', 'referredBy']
        },
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'name', 'type']
        }
      ]
    });

    if (!pendingPayment) {
      console.log('❌ No pending payments found');
      console.log('Creating a test scenario instead...\n');
      
      // Find user with referral chain
      const userWithReferrer = await User.findOne({
        where: { referredBy: { [sequelize.Op.ne]: null } },
        attributes: ['id', 'firstName', 'lastName', 'email', 'walletBalance', 'referredBy']
      });

      if (!userWithReferrer) {
        console.log('❌ No users with referrers found');
        await sequelize.close();
        process.exit(0);
      }

      console.log(`📝 Test Scenario: $1000 investment by ${userWithReferrer.firstName} ${userWithReferrer.lastName}`);
      console.log(`   User ID: ${userWithReferrer.id}`);
      console.log(`   Has Referrer: ${userWithReferrer.referredBy ? 'Yes' : 'No'}`);
      console.log(`   Current Balance: $${parseFloat(userWithReferrer.walletBalance || 0).toFixed(2)}\n`);

      // Simulate commission distribution
      console.log('🔄 Distributing commissions...\n');
      const result = await distributeReferralCommissions(
        userWithReferrer.id,
        1000,
        'Test investment'
      );

      if (result.success) {
        console.log('✅ Commission distribution successful!\n');
        console.log(`📊 Summary:`);
        console.log(`   Total Levels: ${result.totalLevels}`);
        console.log(`   Total Commissions: $${result.totalCommissionsDistributed.toFixed(2)}\n`);
        
        if (result.commissions && result.commissions.length > 0) {
          console.log('💰 Commission Breakdown:');
          result.commissions.forEach(comm => {
            console.log(`   Level ${comm.level}: ${comm.referrerName} - $${comm.commissionAmount.toFixed(2)} (${comm.commissionRate})`);
          });
        }
      } else {
        console.log(`❌ Commission distribution failed: ${result.error}`);
      }

      await sequelize.close();
      process.exit(0);
    }

    console.log('📋 Found Pending Payment:');
    console.log(`   Payment ID: ${pendingPayment.id}`);
    console.log(`   User: ${pendingPayment.user.firstName} ${pendingPayment.user.lastName}`);
    console.log(`   Amount: $${parseFloat(pendingPayment.amount).toFixed(2)}`);
    console.log(`   Portfolio: ${pendingPayment.portfolio?.name || 'N/A'}`);
    console.log(`   User has referrer: ${pendingPayment.user.referredBy ? 'Yes' : 'No'}\n`);

    if (!pendingPayment.user.referredBy) {
      console.log('⚠️  This user has no referrer, so no commissions will be distributed.');
      await sequelize.close();
      process.exit(0);
    }

    // Simulate the approval process
    console.log('🔄 Simulating payment approval process...\n');

    // Step 1: Update payment status (dry run - not actually updating)
    console.log('Step 1: Would update payment status to COMPLETED');
    
    // Step 2: Update user balance (dry run)
    const newBalance = parseFloat(pendingPayment.user.walletBalance) + parseFloat(pendingPayment.amount);
    console.log(`Step 2: Would update user balance from $${parseFloat(pendingPayment.user.walletBalance).toFixed(2)} to $${newBalance.toFixed(2)}`);

    // Step 3: Distribute commissions
    console.log('Step 3: Distributing referral commissions...\n');
    
    const commissionResult = await distributeReferralCommissions(
      pendingPayment.userId,
      parseFloat(pendingPayment.amount),
      `${pendingPayment.portfolio?.name || 'Investment'} investment`
    );

    console.log('\n📊 Commission Distribution Result:');
    console.log('='.repeat(80));
    
    if (commissionResult.success) {
      console.log('✅ SUCCESS\n');
      console.log(`Total Commissions Distributed: $${commissionResult.totalCommissionsDistributed.toFixed(2)}`);
      console.log(`Number of Levels: ${commissionResult.totalLevels}\n`);
      
      if (commissionResult.commissions && commissionResult.commissions.length > 0) {
        console.log('💰 Commission Breakdown:');
        commissionResult.commissions.forEach(comm => {
          console.log(`\n  Level ${comm.level}:`);
          console.log(`    Referrer: ${comm.referrerName}`);
          console.log(`    Email: ${comm.referrerEmail}`);
          console.log(`    Amount: $${comm.commissionAmount.toFixed(2)}`);
          console.log(`    Rate: ${comm.commissionRate}`);
          console.log(`    Transaction ID: ${comm.transactionId}`);
        });
      }

      console.log('\n✅ The commission distribution system is working correctly!');
      console.log('💡 When you approve payments in the admin panel, commissions will be automatically distributed.');
      
    } else {
      console.log('❌ FAILED\n');
      console.log(`Error: ${commissionResult.error}`);
      console.log('\n⚠️  The commission system is NOT working. Check the error above.');
    }

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error during test:', error);
    console.error('Stack:', error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

testPaymentApproval();
