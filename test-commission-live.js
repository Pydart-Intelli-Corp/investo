const { sequelize } = require('./config/database');
const { User, Affiliate } = require('./models');

async function displayTestInstructions() {
  console.log('\n🧪 COMMISSION SYSTEM TEST INSTRUCTIONS');
  console.log('='.repeat(80));
  console.log('\n📋 SERVER STATUS: ✅ RUNNING on http://192.168.1.33:5000\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get the referral code info
    const referralCode = 'REFJMZ8B3Y3';
    const affiliate = await Affiliate.findOne({
      where: { referralCode },
      include: [{ model: User, as: 'user' }]
    });

    if (!affiliate) {
      console.log('❌ Referral code not found');
      await sequelize.close();
      process.exit(1);
    }

    const referrer = affiliate.user;

    console.log('👤 REFERRER INFORMATION:');
    console.log(`   Name: ${referrer.firstName} ${referrer.lastName}`);
    console.log(`   Email: ${referrer.email}`);
    console.log(`   Referral Code: ${referralCode}`);
    console.log(`   Registration Link: http://192.168.1.33:5000/register?ref=${referralCode}`);
    console.log(`\n💰 CURRENT BALANCES:`);
    console.log(`   Wallet Balance: $${parseFloat(referrer.walletBalance || 0).toFixed(2)}`);
    console.log(`   Total Earnings: $${parseFloat(referrer.totalEarnings || 0).toFixed(2)}`);
    console.log(`   Total Commissions: $${parseFloat(referrer.totalCommissions || 0).toFixed(2)}`);

    console.log('\n\n📝 TEST PROCEDURE:');
    console.log('━'.repeat(80));
    
    console.log('\n🔹 STEP 1: Register New User');
    console.log('   1. Open browser: http://192.168.1.33:5000/register?ref=REFJMZ8B3Y3');
    console.log('   2. Fill in registration form:');
    console.log('      - First Name: Test');
    console.log('      - Last Name: User');
    console.log('      - Email: testuser@example.com');
    console.log('      - Phone: +1234567890');
    console.log('      - Password: Test@1234');
    console.log('   3. Submit registration');
    console.log('   4. Verify email (check console logs or database)');
    
    console.log('\n🔹 STEP 2: Login as New User');
    console.log('   1. Go to: http://192.168.1.33:5000/login');
    console.log('   2. Login with testuser@example.com / Test@1234');
    console.log('   3. Complete profile if needed');

    console.log('\n🔹 STEP 3: Make Investment Payment');
    console.log('   1. Go to dashboard: http://192.168.1.33:5000/dashboard');
    console.log('   2. Click "Select Plan" on any investment plan');
    console.log('   3. Enter investment amount: $1000 (minimum)');
    console.log('   4. Click "Proceed to Payment"');
    console.log('   5. Fill payment details:');
    console.log('      - Payment Method: USDT/BTC/ETH/BNB');
    console.log('      - Wallet Address: (copy from payment screen)');
    console.log('      - Transaction Hash: test_hash_12345');
    console.log('      - Upload screenshot (any image)');
    console.log('   6. Submit payment');

    console.log('\n🔹 STEP 4: Approve Payment as Admin');
    console.log('   1. Open new tab: http://192.168.1.33:5000/adminpanel/login');
    console.log('   2. Login as admin');
    console.log('   3. Go to "Payment Management"');
    console.log('   4. Find the pending payment from testuser@example.com');
    console.log('   5. Click "View Details"');
    console.log('   6. Click "Approve" button');
    console.log('   7. Watch for success message');

    console.log('\n🔹 STEP 5: Verify Commission Distribution');
    console.log(`   1. Open: http://192.168.1.33:5000/profile (logged in as ${referrer.email})`);
    console.log('   2. Check dashboard balances:');
    console.log(`      - Total Earnings should increase by $100.00`);
    console.log(`      - Total Commissions should increase by $100.00`);
    console.log(`      - Wallet Balance should increase by $100.00`);
    console.log('   3. Check "Referral Income" section:');
    console.log('      - Level 1 earnings should show $100.00');
    console.log('      - New transaction should appear in history');

    console.log('\n\n✅ EXPECTED RESULTS:');
    console.log('━'.repeat(80));
    console.log('1. ✅ New user registers successfully with referral code');
    console.log('2. ✅ New user can login and make payment');
    console.log('3. ✅ Payment appears in admin panel as PENDING');
    console.log('4. ✅ Admin can approve payment');
    console.log('5. ✅ System AUTOMATICALLY:');
    console.log('   - Updates new user wallet balance (+$1000)');
    console.log('   - Creates commission transaction');
    console.log('   - Updates referrer wallet balance (+$100)');
    console.log('   - Updates referrer totalEarnings (+$100)');
    console.log('   - Updates referrer totalCommissions (+$100)');
    console.log('   - Updates affiliate levelEarnings (level1 +$100)');
    console.log('6. ✅ Referrer dashboard shows updated balances immediately');

    console.log('\n\n🔍 VERIFY IN DATABASE:');
    console.log('━'.repeat(80));
    console.log('After approval, run these commands to verify:');
    console.log('');
    console.log('# Check referrer updated balances:');
    console.log(`SELECT wallet_balance, total_earnings, total_commissions FROM users WHERE id = ${referrer.id};`);
    console.log('');
    console.log('# Check commission transaction created:');
    console.log(`SELECT * FROM transactions WHERE user_id = ${referrer.id} AND type = 'commission' ORDER BY created_at DESC LIMIT 1;`);
    console.log('');
    console.log('# Check affiliate stats updated:');
    console.log(`SELECT total_commissions, available_commissions, level_earnings FROM affiliates WHERE user_id = ${referrer.id};`);

    console.log('\n\n📊 QUICK VERIFICATION SCRIPT:');
    console.log('━'.repeat(80));
    console.log('Run this after payment approval:');
    console.log('node check-user-earnings.js');

    console.log('\n\n' + '='.repeat(80));
    console.log('🎯 Ready to test! Follow the steps above.\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

displayTestInstructions();
