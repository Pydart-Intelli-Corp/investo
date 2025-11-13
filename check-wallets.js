const { AdminWallet } = require('./models');

async function checkWallets() {
  try {
    const wallets = await AdminWallet.findAll({
      attributes: ['id', 'walletType', 'isActive'],
      where: { isActive: true }
    });
    
    console.log('Active wallets in database:');
    wallets.forEach(wallet => {
      console.log(`- ID: ${wallet.id}, WalletType: "${wallet.walletType}", Active: ${wallet.isActive}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkWallets();