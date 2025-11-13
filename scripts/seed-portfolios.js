const { sequelize } = require('./config/database');
const { Portfolio, User } = require('./models');
const logger = require('./utils/logger');

const portfoliosData = [
  {
    name: "Basic Pack (30-Day)",
    description: "AI arbitrage engine with consistent daily returns",
    minInvestment: 100.00,
    maxInvestment: 5000.00,
    dailyROI: 1.0,
    totalReturnLimit: 300.0,
    durationValue: 30,
    durationUnit: 'days',
    type: 'Basic',
    category: '30-Day',
    features: ["AI Arbitrage", "Auto Trading", "Daily Compounding"],
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    gradientColorFrom: '#10b981',
    gradientColorTo: '#059669'
  },
  {
    name: "Basic Pack (365-Day)",
    description: "Extended AI trading with enhanced daily returns",
    minInvestment: 100.00,
    maxInvestment: 5000.00,
    dailyROI: 1.25,
    totalReturnLimit: 300.0,
    durationValue: 365,
    durationUnit: 'days',
    type: 'Basic',
    category: '365-Day',
    features: ["Enhanced ROI", "Long-term Growth", "Capital Protection"],
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    gradientColorFrom: '#059669',
    gradientColorTo: '#0d9488'
  },
  {
    name: "Premium Pack (30-Day)",
    description: "Premium AI algorithms with higher profit margins",
    minInvestment: 5001.00,
    maxInvestment: 25000.00,
    dailyROI: 1.5,
    totalReturnLimit: 350.0,
    durationValue: 30,
    durationUnit: 'days',
    type: 'Premium',
    category: '30-Day',
    features: ["Premium Algorithms", "Priority Execution", "Advanced Analytics"],
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    gradientColorFrom: '#a855f7',
    gradientColorTo: '#ec4899'
  },
  {
    name: "Premium Pack (365-Day)",
    description: "Extended premium trading with maximized returns",
    minInvestment: 5001.00,
    maxInvestment: 25000.00,
    dailyROI: 1.75,
    totalReturnLimit: 350.0,
    durationValue: 365,
    durationUnit: 'days',
    type: 'Premium',
    category: '365-Day',
    features: ["Maximum ROI", "Premium Support", "Exclusive Features"],
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    gradientColorFrom: '#9333ea',
    gradientColorTo: '#7c3aed'
  },
  {
    name: "Elite Pack (30-Day)",
    description: "Elite AI trading for high-value investors",
    minInvestment: 25001.00,
    maxInvestment: 1000000.00,
    dailyROI: 2.0,
    totalReturnLimit: 400.0,
    durationValue: 30,
    durationUnit: 'days',
    type: 'Elite',
    category: '30-Day',
    features: ["Elite Algorithms", "VIP Support", "Highest Returns"],
    subscriptionFee: 25.00,
    requiresSubscription: true,
    isElite: true,
    gradientColorFrom: '#eab308',
    gradientColorTo: '#f97316'
  },
  {
    name: "Elite Pack (365-Day)",
    description: "Ultimate AI trading experience with maximum profitability",
    minInvestment: 25001.00,
    maxInvestment: 1000000.00,
    dailyROI: 2.25,
    totalReturnLimit: 400.0,
    durationValue: 365,
    durationUnit: 'days',
    type: 'Elite',
    category: '365-Day',
    features: ["Ultimate ROI", "White-glove Service", "Elite Features"],
    subscriptionFee: 25.00,
    requiresSubscription: true,
    isElite: true,
    gradientColorFrom: '#ca8a04',
    gradientColorTo: '#dc2626'
  }
];

async function seedPortfolios() {
  try {
    console.log('🌱 Seeding AI-Arbitrage Trading Portfolios...');

    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Check if portfolios already exist
    const existingPortfolios = await Portfolio.count();
    if (existingPortfolios > 0) {
      console.log('✓ Portfolios already exist. Skipping seed.');
      console.log(`Found ${existingPortfolios} existing portfolios.`);
      
      // Optionally show existing portfolios
      const existing = await Portfolio.findAll({
        attributes: ['id', 'name', 'type', 'category'],
        order: [['type', 'ASC'], ['category', 'ASC']]
      });
      
      console.log('Existing portfolios:');
      existing.forEach(p => {
        console.log(`  - ${p.name} (${p.type} - ${p.category})`);
      });
      
      return;
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
    console.log('Creating AI-Arbitrage Trading Portfolios...');
    
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
        totalSubscribers: Math.floor(Math.random() * 500) + 50, // Random subscribers for demo
        activeSubscribers: Math.floor(Math.random() * 300) + 20, // Random active subscribers
        totalVolume: Math.floor(Math.random() * 1000000) + 100000, // Random volume for demo
        totalReturns: Math.floor(Math.random() * 500000) + 50000, // Random returns for demo
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
        tags: [portfolioData.type.toLowerCase(), portfolioData.category.toLowerCase(), 'ai-trading', 'arbitrage'],
        meta: {
          title: `${portfolioData.name} - AI Trading Portfolio`,
          description: portfolioData.description,
          keywords: ['ai trading', 'arbitrage', 'crypto', 'portfolio', portfolioData.type.toLowerCase()]
        },
        botSettings: {
          autoActivation: true,
          activationDelay: 24,
          tradingPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT'],
          riskLevel: portfolioData.type === 'Basic' ? 'Low' : portfolioData.type === 'Premium' ? 'Medium' : 'High'
        }
      });

      console.log(`✅ Created portfolio: ${portfolio.name} (ID: ${portfolio.id})`);
    }

    console.log(`\n🎉 Successfully seeded ${portfoliosData.length} AI-Arbitrage Trading Portfolios!`);
    
    // Display summary
    const summary = await Portfolio.findAll({
      attributes: ['type', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['type'],
      raw: true
    });
    
    console.log('\n📊 Portfolio Summary:');
    summary.forEach(item => {
      console.log(`  ${item.type}: ${item.count} portfolios`);
    });

    console.log('\n✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding portfolios:', error);
    logger.logError('PORTFOLIO_SEED_ERROR', error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedPortfolios().then(() => {
    console.log('Portfolio seeding process completed.');
    process.exit(0);
  }).catch((error) => {
    console.error('Portfolio seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedPortfolios };