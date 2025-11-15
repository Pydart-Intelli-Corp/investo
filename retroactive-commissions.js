const { sequelize } = require('./config/database');
const { Payment, User } = require('./models');
const { distributeReferralCommissions } = require('./utils/commissionCalculator');

async function retroactiveCommissions() {
  console.log('💰 Retroactively Distributing Commissions for Completed Payments\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find all completed payments that don't have commission transactions
    const completedPayments = await Payment.findAll({
      where: { status: 'COMPLETED' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'referredBy']
      }],
      order: [['created_at', 'ASC']]
    });

    console.log(`Found ${completedPayments.length} completed payments\n`);

    if (completedPayments.length === 0) {
      console.log('No completed payments to process.');
      await sequelize.close();
      process.exit(0);
    }

    let totalProcessed = 0;
    let totalCommissionsDistributed = 0;
    const results = [];

    for (const payment of completedPayments) {
      console.log(`\nProcessing Payment ID ${payment.id}:`);
      console.log(`  User: ${payment.user.firstName} ${payment.user.lastName}`);
      console.log(`  Amount: $${parseFloat(payment.amount).toFixed(2)}`);
      console.log(`  Date: ${payment.created_at}`);

      // Check if user has referrers
      if (!payment.user.referredBy) {
        console.log(`  ⚠️  User has no referrer - skipping`);
        results.push({
          paymentId: payment.id,
          status: 'skipped',
          reason: 'No referrer'
        });
        continue;
      }

      console.log(`  ✅ User has referrer - distributing commissions...`);

      // Distribute commissions
      const result = await distributeReferralCommissions(
        payment.userId,
        parseFloat(payment.amount),
        `Retroactive: Payment ID ${payment.id}`
      );

      if (result.success) {
        console.log(`  ✅ Distributed $${result.totalCommissionsDistributed.toFixed(2)} across ${result.totalLevels} levels`);
        totalProcessed++;
        totalCommissionsDistributed += result.totalCommissionsDistributed;
        
        results.push({
          paymentId: payment.id,
          userId: payment.userId,
          amount: payment.amount,
          commissionsDistributed: result.totalCommissionsDistributed,
          levels: result.totalLevels,
          status: 'success',
          details: result.commissions
        });
      } else {
        console.log(`  ❌ Failed: ${result.error}`);
        results.push({
          paymentId: payment.id,
          status: 'failed',
          error: result.error
        });
      }
    }

    // Summary
    console.log('\n\n');
    console.log('='.repeat(80));
    console.log('📊 RETROACTIVE COMMISSION DISTRIBUTION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Payments Processed: ${completedPayments.length}`);
    console.log(`Successfully Distributed: ${totalProcessed}`);
    console.log(`Total Commissions Distributed: $${totalCommissionsDistributed.toFixed(2)}`);
    console.log('\n');

    // Show detailed breakdown
    if (results.filter(r => r.status === 'success').length > 0) {
      console.log('✅ Successful Distributions:\n');
      results.filter(r => r.status === 'success').forEach(r => {
        console.log(`Payment ${r.paymentId}: $${parseFloat(r.amount).toFixed(2)} → $${r.commissionsDistributed.toFixed(2)} (${r.levels} levels)`);
        if (r.details && r.details.length > 0) {
          r.details.forEach(d => {
            console.log(`  Level ${d.level}: ${d.referrerName} - $${d.commissionAmount.toFixed(2)}`);
          });
        }
      });
    }

    if (results.filter(r => r.status === 'skipped').length > 0) {
      console.log('\n⚠️  Skipped Payments:\n');
      results.filter(r => r.status === 'skipped').forEach(r => {
        console.log(`Payment ${r.paymentId}: ${r.reason}`);
      });
    }

    if (results.filter(r => r.status === 'failed').length > 0) {
      console.log('\n❌ Failed Distributions:\n');
      results.filter(r => r.status === 'failed').forEach(r => {
        console.log(`Payment ${r.paymentId}: ${r.error}`);
      });
    }

    console.log('\n✅ Retroactive commission distribution complete!');
    console.log('💡 Check user dashboards to see updated commission balances.\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

retroactiveCommissions();
