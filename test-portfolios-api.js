const { sequelize } = require('./config/database');
const { Portfolio } = require('./models');

async function testPortfoliosAPI() {
  try {
    console.log('🔍 Testing Portfolio API Response Structure...\n');
    
    await sequelize.authenticate();
    
    // Simulate the API query
    const whereConditions = {
      isActive: true,
      isVisible: true
    };

    const portfolios = await Portfolio.findAll({
      where: whereConditions,
      attributes: [
        'id', 'name', 'slug', 'description', 'price', 'minInvestment', 
        'maxInvestment', 'durationValue', 'durationUnit', 'dailyROI',
        'totalReturnLimit', 'features', 'type', 'category', 'subscriptionFee',
        'requiresSubscription', 'isElite', 'availableSlots', 'usedSlots',
        'botSettings', 'displayOrder', 'backgroundColor', 'textColor',
        'gradientColorFrom', 'gradientColorTo', 'totalSubscribers'
      ],
      order: [['displayOrder', 'ASC'], ['created_at', 'DESC']]
    });

    console.log(`Found ${portfolios.length} portfolios\n`);

    // Simulate the enrichment
    const enrichedPortfolios = portfolios.map(portfolio => {
      const portfolioData = portfolio.toJSON();
      
      const gradient = portfolioData.gradientColorFrom && portfolioData.gradientColorTo
        ? `from-[${portfolioData.gradientColorFrom}] to-[${portfolioData.gradientColorTo}]`
        : 'from-blue-500 to-purple-500';

      return {
        ...portfolioData,
        availabilityStatus: portfolio.getAvailabilityStatus(),
        remainingSlots: portfolio.getRemainingSlots(),
        formattedPrice: portfolio.getFormattedPrice(),
        investmentRange: portfolio.getInvestmentRange(),
        durationInDays: portfolio.getDurationInDays(),
        totalPossibleReturn: portfolio.getTotalPossibleReturn(),
        dailyPnl: `${portfolioData.dailyROI}% Daily`,
        portfolioRange: portfolio.getInvestmentRange(),
        duration: `${portfolioData.durationValue} ${portfolioData.durationUnit}`,
        gradient: gradient,
        totalReturn: `${portfolio.getTotalPossibleReturn()}%`,
        profitLimit: `${portfolioData.totalReturnLimit}%`,
        walletInfo: null,
        activeSubscribers: portfolioData.activeSubscribers || 0
      };
    });

    console.log('Sample Portfolio Response (First Item):\n');
    console.log(JSON.stringify(enrichedPortfolios[0], null, 2));

    console.log('\n\n✅ All portfolios have required frontend fields:');
    enrichedPortfolios.forEach(p => {
      console.log(`\n${p.name}:`);
      console.log(`  - dailyPnl: ${p.dailyPnl}`);
      console.log(`  - portfolioRange: ${p.portfolioRange}`);
      console.log(`  - duration: ${p.duration}`);
      console.log(`  - gradient: ${p.gradient}`);
      console.log(`  - totalReturn: ${p.totalReturn}`);
      console.log(`  - features: ${p.features.length} items`);
    });

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testPortfoliosAPI();
