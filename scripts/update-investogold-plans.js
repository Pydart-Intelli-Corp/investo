/**
 * InvestoGold Plans Update Script
 * Updates the portfolio database with new gold & commodity investment plans
 * Based on Dubai-based bullion and commodities investment model
 */

const { sequelize } = require('../config/database');
const { Portfolio, User } = require('../models');

const newInvestoGoldPlans = [
  {
    name: 'AI-Driven Trade Portfolio',
    slug: 'ai-driven-trade-monthly',
    description: 'Diversified gold and commodity trades using automated arbitrage and market-intelligence strategies with monthly performance targets.',
    price: 1000.00,
    minInvestment: 1000.00,
    maxInvestment: 100000.00,
    durationValue: 24,
    durationUnit: 'months',
    dailyROI: 0.30, // ~7-10% monthly = ~0.3% daily
    totalReturnLimit: 120.0, // 100-120% annualized over 24 months
    type: 'Premium',
    category: 'Custom',
    displayOrder: 1,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    features: [
      { name: 'AI-Powered Trading', description: 'Advanced algorithms for gold & commodity arbitrage', included: true },
      { name: 'Monthly Performance', description: 'Target 7-10% monthly returns', included: true },
      { name: 'Diversified Exposure', description: 'Global metals market coverage', included: true },
      { name: 'Principal Return Eligible', description: 'Principal returned at maturity', included: true },
      { name: '24-Month Term', description: 'Fixed investment period for optimal growth', included: true },
      { name: 'Professional Management', description: 'Expert oversight of all trades', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['XAU/USD', 'XAG/USD', 'GOLD/USDT', 'Commodities'],
      riskLevel: 'Medium'
    },
    gradientColorFrom: '#f59e0b',
    gradientColorTo: '#d97706',
    isActive: true,
    isVisible: true
  },
  {
    name: 'Gold Vault Investment',
    slug: 'gold-vault-physical-asset',
    description: 'Secure investment in physical gold stored with accredited vault partners in the UAE. Fully insured with transparent asset ownership.',
    price: 5000.00,
    minInvestment: 5000.00,
    maxInvestment: 500000.00,
    durationValue: 12,
    durationUnit: 'months',
    dailyROI: 0.04, // ~12-15% annual = ~0.04% daily
    totalReturnLimit: 15.0, // 12-15% annual premium
    type: 'Elite',
    category: 'Custom',
    displayOrder: 2,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: true,
    features: [
      { name: 'Physical Gold Ownership', description: 'Real tangible assets in UAE vaults', included: true },
      { name: 'Insurance-Backed', description: 'Fully insured storage and protection', included: true },
      { name: 'Annual Premium 12-15%', description: 'Attractive annual yield on physical gold', included: true },
      { name: 'Monthly Yield', description: 'Regular income distribution', included: true },
      { name: 'Gold Price Appreciation', description: 'Benefit from gold market gains', included: true },
      { name: 'Secure Storage', description: 'Accredited vault partners in Dubai', included: true },
      { name: 'Transparent Ownership', description: 'Full documentation and proof of ownership', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['XAU/USD', 'Physical Gold'],
      riskLevel: 'Low'
    },
    gradientColorFrom: '#eab308',
    gradientColorTo: '#ca8a04',
    isActive: true,
    isVisible: true
  },
  {
    name: 'Weekly Arbitrage Strategy',
    slug: 'weekly-arbitrage-high-performance',
    description: 'High-performance arbitrage program with rapid execution across multiple exchanges. Engineered for investors seeking maximum yield.',
    price: 10000.00,
    minInvestment: 10000.00,
    maxInvestment: 1000000.00,
    durationValue: 24,
    durationUnit: 'months',
    dailyROI: 0.60, // ~3-5% weekly = ~0.6% daily
    totalReturnLimit: 240.0, // 200-240% annualized
    type: 'Elite',
    category: 'Custom',
    displayOrder: 3,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: true,
    features: [
      { name: 'Weekly Performance', description: 'Target 3-5% weekly returns', included: true },
      { name: 'Rapid Execution', description: 'Professional monitoring and fast trade execution', included: true },
      { name: 'Multi-Exchange Coverage', description: 'Arbitrage across major global exchanges', included: true },
      { name: 'High-Yield Model', description: 'Annualized target 200-240%', included: true },
      { name: 'Profits-Only Structure', description: 'Principal not returned - maximize yield', included: true },
      { name: '24-Month Term', description: 'Extended period for compounding growth', included: true },
      { name: 'Active Strategy', description: 'For experienced investors with higher risk appetite', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['XAU/USD', 'XAG/USD', 'GOLD/USDT', 'Multi-Exchange'],
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

    // Deactivate existing portfolios
    console.log('📦 Deactivating old portfolios...');
    await Portfolio.update(
      { isActive: false, isVisible: false },
      { where: {} }
    );
    console.log('✅ Old portfolios deactivated\n');

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
