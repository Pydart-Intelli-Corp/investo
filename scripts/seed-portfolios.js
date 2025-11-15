const { sequelize } = require('../config/database');
const { Portfolio, User } = require('../models');
const logger = require('../utils/logger');

const portfoliosData = [
  {
    name: "AI Driven Trading",
    description: "7-10% Monthly Returns",
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    dailyROI: 0.30, // ~9% monthly average (0.3% daily * 30 days)
    totalReturnLimit: 240.0, // 10% * 24 months = 240%
    durationValue: 24,
    durationUnit: 'months',
    type: 'AI Trading',
    category: 'Monthly',
    features: [
      "7-10% Monthly Returns",
      "24 Month Investment Period",
      "Principal Returned at Maturity",
      "AI-Powered Trading Algorithms",
      "Real-time Portfolio Monitoring"
    ],
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    gradientColorFrom: '#3b82f6',
    gradientColorTo: '#8b5cf6'
  },
  {
    name: "Gold Vault Investment",
    description: "12-15% Annual Returns",
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    dailyROI: 0.0384, // ~14% annual average (14% / 365 days)
    totalReturnLimit: 15.0, // 15% annual max
    durationValue: 12,
    durationUnit: 'months',
    type: 'Gold Vault',
    category: 'Annual',
    features: [
      "12-15% Annual Returns",
      "1 Year Investment Period",
      "Fully Insured",
      "Securely Stored",
      "Physical Gold Backed",
      "Principal + Returns at Maturity"
    ],
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    gradientColorFrom: '#f59e0b',
    gradientColorTo: '#d97706'
  },
  {
    name: "Weekly Arbitrage Strategy",
    description: "3-5% Weekly Returns",
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    dailyROI: 0.571, // ~4% weekly average (4% / 7 days)
    totalReturnLimit: 480.0, // ~4% * 104 weeks (24 months) = 416%, capped at 480%
    durationValue: 24,
    durationUnit: 'months',
    type: 'Arbitrage',
    category: 'Weekly',
    features: [
      "3-5% Weekly Returns",
      "24 Month Investment Period",
      "High-Frequency Trading",
      "Cross-Exchange Arbitrage",
      "Principal NOT Returned"
    ],
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    gradientColorFrom: '#10b981',
    gradientColorTo: '#059669'
  }
];

async function seedPortfolios() {
  try {
    console.log('🌱 Seeding InvestoGold Investment Plans...');

    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Check if portfolios already exist
    const existingPortfolios = await Portfolio.count();
    if (existingPortfolios > 0) {
      console.log('⚠️  Portfolios already exist. Clearing them first...');
      await Portfolio.destroy({ where: {}, truncate: false });
      console.log('✓ Existing portfolios cleared.');
    }

    // Find admin user or create one
    let adminUser = await User.findOne({ where: { email: 'admin@investogold.com' } });
    
    if (!adminUser) {
      console.log('Admin user not found, creating one...');
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      
      adminUser = await User.create({
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@investogold.com',
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        role: 'admin',
        referralCode: 'ADMIN001',
        isProfileComplete: true
      });
      console.log('Admin user created successfully');
    }

    // Create portfolios
    console.log('Creating InvestoGold Investment Plans...');
    
    for (let i = 0; i < portfoliosData.length; i++) {
      const portfolioData = portfoliosData[i];
      
      const portfolio = await Portfolio.create({
        ...portfolioData,
        price: portfolioData.minInvestment, // Set price to minimum investment
        displayOrder: i + 1,
        isActive: true,
        isVisible: true,
        availableSlots: -1, // Unlimited slots
        usedSlots: 0,
        totalSubscribers: Math.floor(Math.random() * 200) + 50, // Random subscribers for demo
        activeSubscribers: Math.floor(Math.random() * 150) + 20, // Random active subscribers
        totalVolume: Math.floor(Math.random() * 5000000) + 500000, // Random volume for demo
        totalReturns: Math.floor(Math.random() * 1000000) + 100000, // Random returns for demo
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
        tags: [portfolioData.type.toLowerCase(), portfolioData.category.toLowerCase(), 'investogold', 'gold', 'ai-trading'],
        meta: {
          title: `${portfolioData.name} - InvestoGold Investment Plan`,
          description: portfolioData.description,
          keywords: ['investogold', 'gold investment', 'ai trading', portfolioData.type.toLowerCase()],
          principalReturn: portfolioData.name === "Gold Vault Investment" || portfolioData.name === "AI Driven Trading"
        },
        botSettings: {
          autoActivation: true,
          activationDelay: 24,
          tradingPairs: portfolioData.type === 'Gold Vault' 
            ? ['GOLD/USD', 'GOLD/EUR'] 
            : ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT'],
          riskLevel: portfolioData.type === 'Gold Vault' ? 'Low' : portfolioData.type === 'AI Trading' ? 'Medium' : 'High'
        }
      });

      console.log(`✅ Created plan: ${portfolio.name} (ID: ${portfolio.id})`);
    }

    console.log(`\n🎉 Successfully seeded ${portfoliosData.length} InvestoGold Investment Plans!`);
    
    // Display summary
    const summary = await Portfolio.findAll({
      attributes: ['type', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['type'],
      raw: true
    });
    
    console.log('\n📊 Investment Plan Summary:');
    summary.forEach(item => {
      console.log(`  ${item.type}: ${item.count} plan(s)`);
    });

    console.log('\n✅ InvestoGold database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding investment plans:', error);
    logger.logError('PORTFOLIO_SEED_ERROR', error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedPortfolios().then(() => {
    console.log('Investment plan seeding process completed.');
    process.exit(0);
  }).catch((error) => {
    console.error('Investment plan seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedPortfolios };