const { sequelize } = require('../config/database');
const { Portfolio, User } = require('../models');

async function addNewPortfolios() {
  try {
    console.log('Adding new AI-Arbitrage portfolios...');
    
    // Get the admin user
    const adminUser = await User.findOne({ 
      where: { role: 'admin' } 
    });
    
    if (!adminUser) {
      console.error('Admin user not found. Please run the main migration first.');
      return;
    }

    // Check if new portfolios already exist
    const existingStarter = await Portfolio.findOne({ where: { slug: 'starter-ai-arbitrage' } });
    if (existingStarter) {
      console.log('New portfolios already exist. Skipping creation.');
      return;
    }

    const newPortfolios = [
      {
        name: 'Starter AI-Arbitrage',
        slug: 'starter-ai-arbitrage',
        description: 'Entry-level AI arbitrage bot perfect for newcomers to cryptocurrency trading.',
        price: 50.00,
        minInvestment: 25.00,
        maxInvestment: 500.00,
        durationValue: 15,
        durationUnit: 'days',
        dailyROI: 1.8,
        totalReturnLimit: 120.0,
        type: 'Basic',
        category: '30-Day',
        displayOrder: 1,
        features: [
          { name: 'Basic Arbitrage Scanner', description: 'Monitors 15+ major exchanges for price differences', included: true },
          { name: 'Automated Trade Execution', description: 'Simple buy-low, sell-high automation', included: true },
          { name: 'Email Notifications', description: 'Daily profit reports via email', included: true },
          { name: 'Basic Risk Controls', description: 'Simple stop-loss and position limits', included: true }
        ],
        totalSubscribers: 1247,
        activeSubscribers: 892,
        createdBy: adminUser.id
      },
      {
        name: 'Pro AI-Arbitrage',
        slug: 'pro-ai-arbitrage',
        description: 'Professional-grade arbitrage system with advanced AI algorithms and multi-market coverage.',
        price: 750.00,
        minInvestment: 500.00,
        maxInvestment: 10000.00,
        durationValue: 120,
        durationUnit: 'days',
        dailyROI: 4.2,
        totalReturnLimit: 350.0,
        type: 'Premium',
        category: '365-Day',
        displayOrder: 4,
        features: [
          { name: 'Advanced Neural Networks', description: 'Deep learning algorithms for pattern recognition', included: true },
          { name: 'Cross-Chain Arbitrage', description: 'Exploits price differences across different blockchains', included: true },
          { name: 'Real-time Analytics Dashboard', description: 'Live performance tracking and insights', included: true },
          { name: 'Smart Risk Management', description: 'AI-powered position sizing and risk assessment', included: true },
          { name: 'Priority Trade Routes', description: 'Faster execution through premium exchange APIs', included: true }
        ],
        totalSubscribers: 658,
        activeSubscribers: 456,
        createdBy: adminUser.id
      },
      {
        name: 'Quantum AI-Arbitrage',
        slug: 'quantum-ai-arbitrage',
        description: 'Next-generation quantum-enhanced AI for institutional-level arbitrage trading with maximum efficiency.',
        price: 2500.00,
        minInvestment: 2000.00,
        maxInvestment: 100000.00,
        durationValue: 180,
        durationUnit: 'days',
        dailyROI: 6.5,
        totalReturnLimit: 800.0,
        type: 'Elite',
        category: '365-Day',
        subscriptionFee: 150.00,
        requiresSubscription: true,
        isElite: true,
        displayOrder: 6,
        features: [
          { name: 'Quantum Computing Integration', description: 'Quantum algorithms for ultra-fast market analysis', included: true },
          { name: 'Institutional Exchange Access', description: 'Direct access to professional trading platforms', included: true },
          { name: 'Predictive Market Modeling', description: 'AI predicts arbitrage opportunities before they appear', included: true },
          { name: 'White-Glove Service', description: 'Dedicated trading specialist and 24/7 concierge support', included: true },
          { name: 'Custom Strategy Development', description: 'Personalized AI trading strategies based on your goals', included: true },
          { name: 'Multi-Asset Arbitrage', description: 'Crypto, forex, and commodities arbitrage opportunities', included: true }
        ],
        totalSubscribers: 127,
        activeSubscribers: 94,
        createdBy: adminUser.id
      }
    ];

    // Create new portfolios
    for (const portfolioData of newPortfolios) {
      const portfolio = await Portfolio.create(portfolioData);
      console.log(`✓ Created portfolio: ${portfolio.name}`);
    }

    console.log('🎉 Successfully added 3 new AI-Arbitrage portfolios!');
    
  } catch (error) {
    console.error('❌ Failed to add new portfolios:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the script
addNewPortfolios()
  .then(() => {
    console.log('Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });