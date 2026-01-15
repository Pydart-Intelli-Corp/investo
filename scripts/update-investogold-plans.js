/**
 * InvestoGold Plans Update Script
 * Updates the portfolio database with new gold & commodity investment plans
 * Based on Dubai-based bullion and commodities investment model
 */

const { sequelize } = require('../config/database');
const { Portfolio, User } = require('../models');

const newInvestoGoldPlans = [
  {
    name: 'AI-Driven Trading Portfolio',
    slug: 'ai-driven-trading-portfolio',
    description: 'Advanced AI algorithms execute data-driven trades across global markets, focusing on risk management and consistent monthly performance.',
    price: 1000.00,
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    durationValue: 24,
    durationUnit: 'months',
    dailyROI: 0.30, // ~7-10% monthly = ~0.3% daily
    totalReturnLimit: 240.0, // 7-10% monthly over 24 months
    type: 'Premium',
    category: 'AI Trading',
    displayOrder: 1,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    features: [
      { name: '7% – 10% Monthly Returns', description: 'Consistent monthly performance', included: true },
      { name: '24 Months Investment Period', description: 'Medium-term horizon', included: true },
      { name: 'Principal Return at Maturity', description: 'Capital protection guaranteed', included: true },
      { name: 'Advanced AI Algorithms', description: 'Data-driven trade execution', included: true },
      { name: 'Risk Management Focus', description: 'Steady growth with capital protection', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['XAU/USD', 'GOLD/USDT', 'Global Markets'],
      riskLevel: 'Medium'
    },
    gradientColorFrom: '#3b82f6',
    gradientColorTo: '#1d4ed8',
    isActive: true,
    isVisible: true
  },
  {
    name: 'Gold Vault Investment',
    slug: 'gold-vault-investment',
    description: 'Capital allocated to physical gold assets stored in fully insured, high-security vaults, offering stability and long-term value appreciation.',
    price: 1000.00,
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    durationValue: 12,
    durationUnit: 'months',
    dailyROI: 0.04, // ~12-15% annual = ~0.04% daily
    totalReturnLimit: 15.0, // 12-15% annual
    type: 'Premium',
    category: 'Physical Assets',
    displayOrder: 2,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    features: [
      { name: '12% – 15% Annual Returns', description: 'Stable yearly returns', included: true },
      { name: '1 Year Investment Period', description: 'Annual investment term', included: true },
      { name: 'Fully Insured Gold', description: 'Complete insurance coverage', included: true },
      { name: 'High-Security Vaults', description: 'Securely stored physical gold', included: true },
      { name: 'Asset-Backed Investment', description: 'Wealth preservation focus', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['Physical Gold', 'XAU/USD'],
      riskLevel: 'Low'
    },
    gradientColorFrom: '#eab308',
    gradientColorTo: '#ca8a04',
    isActive: true,
    isVisible: true
  },
  {
    name: 'Weekly Arbitrage Strategy',
    slug: 'weekly-arbitrage-strategy',
    description: 'High-frequency arbitrage across price differentials in global markets, optimized for aggressive growth and high-risk, high-reward returns.',
    price: 5000.00,
    minInvestment: 5000.00,
    maxInvestment: 1000000.00,
    durationValue: 24,
    durationUnit: 'months',
    dailyROI: 0.60, // ~3-5% weekly = ~0.6% daily
    totalReturnLimit: 240.0, // High yield profits-only model
    type: 'Elite',
    category: 'Arbitrage',
    displayOrder: 3,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: true,
    features: [
      { name: '3% – 5% Weekly Returns', description: 'Aggressive income generation', included: true },
      { name: '24 Months Investment Period', description: 'Extended investment term', included: true },
      { name: 'Principal NOT Returned', description: 'Profits-only model', included: true },
      { name: 'High-Frequency Arbitrage', description: 'Price differential optimization', included: true },
      { name: 'Global Market Coverage', description: 'Multi-market arbitrage opportunities', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['Global Markets', 'Multi-Asset Arbitrage'],
      riskLevel: 'High'
    },
    gradientColorFrom: '#dc2626',
    gradientColorTo: '#991b1b',
    isActive: true,
    isVisible: true
  }
];

async function updateInvestoGoldPlans() {
  try {
    console.log('🔄 Starting InvestoGold Plans Update...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');

    // Get admin user
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      throw new Error('Admin user not found. Please create admin user first.');
    }

    console.log('👤 Admin user found:', adminUser.email, '\n');

    // Delete existing portfolios and update existing plans with unique slugs
    console.log('📦 Handling old portfolios...');
    
    // First, check if any of our new slugs exist
    const existingSlugs = ['ai-driven-trading', 'gold-vault-investment', 'weekly-arbitrage-strategy'];
    const existingPlans = await Portfolio.findAll({
      where: {
        slug: existingSlugs
      }
    });

    if (existingPlans.length > 0) {
      console.log(`Found ${existingPlans.length} existing plans with conflicting slugs`);
      
      // Update the slugs of existing plans to avoid conflicts
      for (const plan of existingPlans) {
        await plan.update({
          slug: `${plan.slug}-old-${Date.now()}`,
          isActive: false,
          isVisible: false
        });
      }
      console.log('✅ Deactivated conflicting plans with renamed slugs');
    } else {
      console.log('No conflicting slugs found');
    }

    // Deactivate all other portfolios
    await Portfolio.update(
      { isActive: false, isVisible: false },
      { where: {} }
    );
    console.log('✅ All old portfolios deactivated\n');

    // Create new InvestoGold plans
    console.log('🆕 Creating new InvestoGold plans...\n');
    
    for (const planData of newInvestoGoldPlans) {
      const plan = await Portfolio.create({
        ...planData,
        createdBy: adminUser.id,
        totalSubscribers: 0,
        activeSubscribers: 0,
        totalVolume: 0,
        totalReturns: 0,
        usedSlots: 0,
        availableSlots: -1 // Unlimited
      });

      console.log(`✅ Created: ${plan.name}`);
      console.log(`   Type: ${plan.type} | Category: ${plan.category}`);
      console.log(`   Investment Range: $${plan.minInvestment.toLocaleString()} - $${plan.maxInvestment.toLocaleString()}`);
      console.log(`   Term: ${plan.durationValue} ${plan.durationUnit}`);
      console.log(`   Daily ROI: ${plan.dailyROI}%`);
      console.log('');
    }

    // Display summary
    console.log('\n📊 InvestoGold Plans Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const plans = await Portfolio.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC']]
    });

    plans.forEach((plan, index) => {
      console.log(`\n${index + 1}. ${plan.name}`);
      console.log(`   Investment: $${plan.minInvestment.toLocaleString()} - $${plan.maxInvestment.toLocaleString()}`);
      console.log(`   Duration: ${plan.durationValue} ${plan.durationUnit}`);
      console.log(`   Returns: ${plan.totalReturnLimit}% total`);
      console.log(`   Type: ${plan.type} | Category: ${plan.category}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ InvestoGold Plans Update Complete!');
    console.log('\n🌍 Website: www.investogold.com');
    console.log('📍 Based in: Dubai, UAE');
    console.log('💼 Expertise: 10+ years in gold & commodities\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating plans:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the update
if (require.main === module) {
  updateInvestoGoldPlans();
}

module.exports = { updateInvestoGoldPlans, newInvestoGoldPlans };
