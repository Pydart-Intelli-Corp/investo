/**
 * InvestoGold Plans Update Script
 * Updates the portfolio database with new gold & commodity investment plans
 * Based on Dubai-based bullion and commodities investment model
 */

const { sequelize } = require('../config/database');
const { Portfolio, User } = require('../models');

const newInvestoGoldPlans = [
  {
    name: 'AI-Driven Trading',
    slug: 'ai-driven-trading',
    description: '7-10% monthly returns with principal eligible for return at maturity',
    price: 1000.00,
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    durationValue: 24,
    durationUnit: 'months',
    dailyROI: 0.30, // ~7-10% monthly = ~0.3% daily
    totalReturnLimit: 240.0, // 7-10% monthly over 24 months
    type: 'Premium',
    category: 'Custom',
    displayOrder: 1,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    features: [
      { name: '7-10% Monthly Returns', description: 'Consistent monthly performance', included: true },
      { name: '24 Months Investment Period', description: 'Fixed term investment', included: true },
      { name: 'Principal Return at Maturity', description: 'Get your capital back', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['XAU/USD', 'GOLD/USDT'],
      riskLevel: 'Medium'
    },
    gradientColorFrom: '#f59e0b',
    gradientColorTo: '#d97706',
    isActive: true,
    isVisible: true
  },
  {
    name: 'Gold Vault Investment',
    slug: 'gold-vault-investment',
    description: '12-15% annual returns, fully insured and securely stored',
    price: 1000.00,
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    durationValue: 12,
    durationUnit: 'months',
    dailyROI: 0.04, // ~12-15% annual = ~0.04% daily
    totalReturnLimit: 15.0, // 12-15% annual
    type: 'Premium',
    category: 'Custom',
    displayOrder: 2,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: false,
    features: [
      { name: '12-15% Annual Returns', description: 'Stable yearly returns', included: true },
      { name: '1 Year Investment Period', description: 'Annual investment term', included: true },
      { name: 'Fully Insured', description: 'Protected investment', included: true },
      { name: 'Securely Stored', description: 'Safe storage facility', included: true }
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
    slug: 'weekly-arbitrage-strategy',
    description: '3-5% weekly returns, principal not returned',
    price: 1000.00,
    minInvestment: 1000.00,
    maxInvestment: 1000000.00,
    durationValue: 24,
    durationUnit: 'months',
    dailyROI: 0.60, // ~3-5% weekly = ~0.6% daily
    totalReturnLimit: 240.0, // High yield profits-only model
    type: 'Elite',
    category: 'Custom',
    displayOrder: 3,
    subscriptionFee: 0.00,
    requiresSubscription: false,
    isElite: true,
    features: [
      { name: '3-5% Weekly Returns', description: 'High performance weekly gains', included: true },
      { name: '24 Months Investment Period', description: 'Extended investment term', included: true },
      { name: 'Principal Not Returned', description: 'Profits-only model', included: true }
    ],
    botSettings: {
      autoActivation: true,
      activationDelay: 24,
      tradingPairs: ['XAU/USD', 'GOLD/USDT'],
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

    // Delete existing portfolios to avoid slug conflicts
    console.log('📦 Deleting old portfolios...');
    await Portfolio.destroy({
      where: {},
      force: true
    });
    console.log('✅ Old portfolios deleted\n');

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
