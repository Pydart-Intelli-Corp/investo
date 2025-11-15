const { sequelize } = require('./config/database');
const { Affiliate } = require('./models');

async function fixAffiliateLevelEarnings() {
  console.log('🔧 Fixing Affiliate Level Earnings\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Fix user 20's affiliate record
    const affiliate = await Affiliate.findOne({ where: { userId: 20 } });

    if (!affiliate) {
      console.log('Affiliate not found');
      await sequelize.close();
      process.exit(1);
    }

    console.log('Current Level Earnings:', affiliate.levelEarnings);
    console.log(`Total Commissions: $${parseFloat(affiliate.totalCommissions).toFixed(2)}\n`);

    // Update level1 earnings to match total commissions
    const newLevelEarnings = {
      level1: parseFloat(affiliate.totalCommissions || 0),
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0
    };

    await affiliate.update({
      levelEarnings: newLevelEarnings
    });

    // Force save
    affiliate.changed('levelEarnings', true);
    await affiliate.save();

    console.log('✅ Updated Level Earnings:', newLevelEarnings);

    // Also fix user 16 (SAS) who has $200 in commissions
    const affiliate16 = await Affiliate.findOne({ where: { userId: 16 } });
    if (affiliate16) {
      const newLevelEarnings16 = {
        level1: parseFloat(affiliate16.totalCommissions || 0),
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0
      };

      await affiliate16.update({
        levelEarnings: newLevelEarnings16
      });
      affiliate16.changed('levelEarnings', true);
      await affiliate16.save();

      console.log(`\n✅ Also fixed User 16 (SAS) levelEarnings: $${parseFloat(affiliate16.totalCommissions).toFixed(2)}`);
    }

    // Fix user 19 who has commissions too
    const affiliate19 = await Affiliate.findOne({ where: { userId: 19 } });
    if (affiliate19 && parseFloat(affiliate19.totalCommissions) > 0) {
      const newLevelEarnings19 = {
        level1: parseFloat(affiliate19.totalCommissions || 0),
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0
      };

      await affiliate19.update({
        levelEarnings: newLevelEarnings19
      });
      affiliate19.changed('levelEarnings', true);
      await affiliate19.save();

      console.log(`✅ Also fixed User 19 levelEarnings: $${parseFloat(affiliate19.totalCommissions).toFixed(2)}`);
    }

    console.log('\n✅ All affiliate records fixed!');
    console.log('\n💡 Now login and check dashboard - level earnings should display correctly.\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

fixAffiliateLevelEarnings();
