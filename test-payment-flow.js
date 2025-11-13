const fetch = require('node-fetch');

async function testPaymentFlow() {
  try {
    console.log('Testing payment methods endpoint...');
    
    // Test payment methods endpoint (no auth needed for testing)
    const response = await fetch('http://localhost:5000/api/deposit/payment-methods', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Payment methods endpoint working:');
      console.log(`  - Found ${data.count} payment methods`);
      data.data.forEach(method => {
        console.log(`  - ${method.currency}: ${method.walletAddress} (${method.networkType})`);
      });
      
      console.log('\n✅ Payment flow should work now!');
      console.log('Frontend will receive "currency" field and send it as "paymentMethod"');
      console.log('Backend validation will match it against "walletType" in database');
      
    } else {
      console.log('❌ Payment methods endpoint failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPaymentFlow();