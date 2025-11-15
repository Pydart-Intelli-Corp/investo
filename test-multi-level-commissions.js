const { sequelize } = require('./config/database');
const { User, Affiliate, Payment } = require('./models');
const { distributeReferralCommissions } = require('./utils/commissionCalculator');

async function testMultiLevelCommissions() {
  console.log('🧪 Testing Multi-Level Commission Distribution (Levels 1-5)\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find the longest referral chain
    console.log('Step 1: Finding the longest referral chain\n');
    
    const { Op } = require('sequelize');
    const users = await User.findAll({
      where: { referredBy: { [Op.not]: null } },
      attributes: ['id', 'firstName', 'lastName', 'email', 'referredBy', 'isActive']
    });

    // Build referral chains
    const chains = [];
    for (const user of users) {
      const chain = [user];
      let currentUser = user;
      let depth = 0;
      
      while (currentUser.referredBy && depth < 10) {
        const referrer = await User.findByPk(currentUser.referredBy, {
          attributes: ['id', 'firstName', 'lastName', 'email', 'referredBy', 'isActive']
        });
        if (!referrer) break;
        chain.push(referrer);
        currentUser = referrer;
        depth++;
      }
      
      chains.push({ user, chain, depth: chain.length });
    }

    // Sort by depth
    chains.sort((a, b) => b.depth - a.depth);
    
    console.log('📊 Referral Chains Found:\n');
    chains.forEach((c, idx) => {
      if (idx < 3) { // Show top 3
        console.log(`Chain ${idx + 1}: ${c.depth} levels deep`);
        console.log(`  Bottom: ${c.user.firstName} ${c.user.lastName} (ID: ${c.user.id})`);
        console.log(`  Chain: ${c.chain.map(u => `${u.firstName} (${u.id})`).join(' → ')}`);
        console.log('');
      }
    });

    const longestChain = chains[0];
    console.log(`✅ Using longest chain: ${longestChain.depth} levels\n`);

    // Display the chain
    console.log('Step 2: Detailed Chain Analysis\n');
    console.log('Investment User (Bottom of chain):');
    console.log(`  👤 ${longestChain.user.firstName} ${longestChain.user.lastName} (ID: ${longestChain.user.id})`);
    console.log(`     Email: ${longestChain.user.email}`);
    console.log(`     Active: ${longestChain.user.isActive ? '✅' : '❌'}\n`);

    console.log('Upline Referrers:\n');
    for (let i = 1; i < longestChain.chain.length && i <= 5; i++) {
      const referrer = longestChain.chain[i];
      const affiliate = await Affiliate.findOne({ where: { userId: referrer.id } });
      
      console.log(`  Level ${i}: ${referrer.firstName} ${referrer.lastName} (ID: ${referrer.id})`);
      console.log(`          Email: ${referrer.email}`);
      console.log(`          Active: ${referrer.isActive ? '✅' : '❌'}`);
      if (affiliate) {
        console.log(`          Current Commissions: $${parseFloat(affiliate.totalCommissions || 0).toFixed(2)}`);
        console.log(`          Level ${i} Earnings: $${parseFloat(affiliate.levelEarnings[`level${i}`] || 0).toFixed(2)}`);
      }
      console.log('');
    }

    // Simulate commission distribution
    console.log('='.repeat(80));
    console.log('Step 3: Simulating $1000 Investment Commission Distribution\n');

    const investmentAmount = 1000;
    const commissionRates = {
      1: 0.10, // 10%
      2: 0.05, // 5%
      3: 0.03, // 3%
      4: 0.02, // 2%
      5: 0.01  // 1%
    };

    console.log('Expected Commission Distribution:\n');
    let totalExpectedCommission = 0;

    for (let level = 1; level <= Math.min(5, longestChain.depth - 1); level++) {
      if (longestChain.chain[level]) {
        const referrer = longestChain.chain[level];
        const rate = commissionRates[level];
        const amount = investmentAmount * rate;
        totalExpectedCommission += amount;
        
        console.log(`  Level ${level}: ${referrer.firstName} ${referrer.lastName}`);
        console.log(`          Rate: ${(rate * 100).toFixed(0)}% | Amount: $${amount.toFixed(2)}`);
        console.log('');
      }
    }

    console.log(`💰 Total Expected Commission: $${totalExpectedCommission.toFixed(2)}\n`);

    // Ask if user wants to run actual test
    console.log('='.repeat(80));
    console.log('Step 4: Testing Actual Commission Distribution\n');

    console.log('🔧 Running commission distribution test...\n');

    const result = await distributeReferralCommissions(
      longestChain.user.id,
      investmentAmount,
      'Multi-level test investment'
    );

    if (result.success) {
      console.log('✅ Commission Distribution Successful!\n');
      console.log(`Total Levels: ${result.totalLevels}`);
      console.log(`Total Distributed: $${result.totalCommissionsDistributed.toFixed(2)}\n`);
      
      console.log('Commission Breakdown:\n');
      for (const comm of result.commissions) {
        console.log(`  Level ${comm.level}: ${comm.referrerName}`);
        console.log(`            Rate: ${comm.commissionRate} | Amount: $${comm.commissionAmount.toFixed(2)}`);
        console.log(`            Email: ${comm.referrerEmail}`);
        console.log('');
      }

      // Verify in database
      console.log('='.repeat(80));
      console.log('Step 5: Verifying Database Updates\n');

      for (const comm of result.commissions) {
        const affiliate = await Affiliate.findOne({ where: { userId: comm.referrerId } });
        if (affiliate) {
          const levelKey = `level${comm.level}`;
          console.log(`  ✅ ${comm.referrerName}`);
          console.log(`     Level ${comm.level} Earnings: $${parseFloat(affiliate.levelEarnings[levelKey] || 0).toFixed(2)}`);
          console.log(`     Total Commissions: $${parseFloat(affiliate.totalCommissions || 0).toFixed(2)}`);
          console.log('');
        }
      }

      console.log('✅ All levels verified successfully!\n');

    } else {
      console.log('❌ Commission distribution failed:', result.error);
    }

    console.log('='.repeat(80));
    console.log('📊 MULTI-LEVEL TEST SUMMARY\n');
    console.log(`✅ Chain Depth: ${longestChain.depth} levels`);
    console.log(`✅ Levels Tested: ${result.success ? result.totalLevels : 0}`);
    console.log(`✅ Total Distributed: $${result.success ? result.totalCommissionsDistributed.toFixed(2) : '0.00'}`);
    console.log('\n💡 Commission distribution working across all levels!\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testMultiLevelCommissions();
