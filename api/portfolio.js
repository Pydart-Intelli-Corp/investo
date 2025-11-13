const express = require('express');
const router = express.Router();
const { Portfolio } = require('../models');
const { protect } = require('../middleware/auth');

// @route   GET /api/portfolios
// @desc    Get all active portfolios
// @access  Public
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.getActivePortfolios();
    
    // Transform data for frontend consumption
    const transformedPortfolios = portfolios.map(portfolio => ({
      id: portfolio.id,
      name: portfolio.name,
      slug: portfolio.slug,
      description: portfolio.description,
      dailyPnl: `${portfolio.dailyROI}%`,
      portfolioRange: portfolio.getInvestmentRange(),
      duration: `${portfolio.durationValue} ${portfolio.durationUnit.slice(0, -1)}${portfolio.durationValue === 1 ? '' : 's'}`,
      capitalReturned: true, // Always true for our business model
      gradient: portfolio.type === 'Basic' ? 'from-green-500 to-emerald-500' :
                portfolio.type === 'Premium' ? 'from-purple-500 to-pink-500' :
                'from-yellow-500 to-orange-500',
      features: portfolio.features || [],
      totalReturn: `${portfolio.totalReturnLimit}% total`,
      profitLimit: `${portfolio.totalReturnLimit / 100}x limit`,
      type: portfolio.type,
      category: portfolio.category,
      isElite: portfolio.isElite,
      subscriptionFee: portfolio.subscriptionFee ? `$${portfolio.subscriptionFee}` : null,
      walletInfo: portfolio.isElite ? 'USDT (BEP20) Binance' : null,
      minInvestment: parseFloat(portfolio.minInvestment),
      maxInvestment: parseFloat(portfolio.maxInvestment),
      dailyROI: parseFloat(portfolio.dailyROI),
      requiresSubscription: portfolio.requiresSubscription,
      availabilityStatus: portfolio.getAvailabilityStatus(),
      remainingSlots: portfolio.getRemainingSlots(),
      totalSubscribers: portfolio.totalSubscribers,
      activeSubscribers: portfolio.activeSubscribers
    }));

    res.json({
      success: true,
      data: transformedPortfolios,
      count: transformedPortfolios.length
    });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolios',
      error: error.message
    });
  }
});

// @route   GET /api/portfolios/:id
// @desc    Get specific portfolio details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne({
      where: { 
        id: id,
        isActive: true,
        isVisible: true
      }
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Transform for detailed view
    const portfolioDetails = {
      id: portfolio.id,
      name: portfolio.name,
      slug: portfolio.slug,
      description: portfolio.description,
      price: parseFloat(portfolio.price),
      minInvestment: parseFloat(portfolio.minInvestment),
      maxInvestment: parseFloat(portfolio.maxInvestment),
      dailyROI: parseFloat(portfolio.dailyROI),
      totalReturnLimit: parseFloat(portfolio.totalReturnLimit),
      durationValue: portfolio.durationValue,
      durationUnit: portfolio.durationUnit,
      features: portfolio.features || [],
      type: portfolio.type,
      category: portfolio.category,
      subscriptionFee: parseFloat(portfolio.subscriptionFee),
      requiresSubscription: portfolio.requiresSubscription,
      isElite: portfolio.isElite,
      availableSlots: portfolio.availableSlots,
      usedSlots: portfolio.usedSlots,
      totalSubscribers: portfolio.totalSubscribers,
      activeSubscribers: portfolio.activeSubscribers,
      totalVolume: parseFloat(portfolio.totalVolume),
      availabilityStatus: portfolio.getAvailabilityStatus(),
      remainingSlots: portfolio.getRemainingSlots(),
      durationInDays: portfolio.getDurationInDays()
    };

    res.json({
      success: true,
      data: portfolioDetails
    });
  } catch (error) {
    console.error('Error fetching portfolio details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio details',
      error: error.message
    });
  }
});

// @route   POST /api/portfolios/:id/check-eligibility
// @desc    Check if user can subscribe to portfolio
// @access  Private
router.post('/:id/check-eligibility', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { investmentAmount } = req.body;
    const userId = req.user.id;

    // Get user details
    const { User } = require('../models');
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get portfolio
    const portfolio = await Portfolio.findOne({
      where: { 
        id: id,
        isActive: true,
        isVisible: true
      }
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Check eligibility
    const eligibilityCheck = portfolio.canUserSubscribe(user, parseFloat(investmentAmount));
    
    // Calculate potential earnings
    const dailyEarnings = portfolio.calculateDailyEarnings(parseFloat(investmentAmount));
    const totalEarnings = portfolio.calculateTotalEarnings(parseFloat(investmentAmount));
    const totalDays = portfolio.getDurationInDays();

    res.json({
      success: true,
      data: {
        canSubscribe: eligibilityCheck.canSubscribe,
        errors: eligibilityCheck.errors,
        calculations: {
          investmentAmount: parseFloat(investmentAmount),
          dailyEarnings: dailyEarnings,
          totalEarnings: totalEarnings,
          totalDays: totalDays,
          subscriptionFee: parseFloat(portfolio.subscriptionFee),
          totalRequired: parseFloat(investmentAmount) + (portfolio.requiresSubscription ? parseFloat(portfolio.subscriptionFee) : 0)
        },
        portfolio: {
          name: portfolio.name,
          type: portfolio.type,
          dailyROI: parseFloat(portfolio.dailyROI),
          totalReturnLimit: parseFloat(portfolio.totalReturnLimit),
          requiresSubscription: portfolio.requiresSubscription,
          isElite: portfolio.isElite
        }
      }
    });
  } catch (error) {
    console.error('Error checking portfolio eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility',
      error: error.message
    });
  }
});

// @route   GET /api/portfolios/types/:type
// @desc    Get portfolios by type (Basic, Premium, Elite)
// @access  Public
router.get('/types/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate type
    if (!['Basic', 'Premium', 'Elite'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid portfolio type. Must be Basic, Premium, or Elite.'
      });
    }

    const portfolios = await Portfolio.getByType(type);
    
    // Transform data
    const transformedPortfolios = portfolios.map(portfolio => ({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
      dailyROI: parseFloat(portfolio.dailyROI),
      investmentRange: portfolio.getInvestmentRange(),
      duration: `${portfolio.durationValue} ${portfolio.durationUnit}`,
      features: portfolio.features || [],
      availabilityStatus: portfolio.getAvailabilityStatus(),
      totalSubscribers: portfolio.totalSubscribers
    }));

    res.json({
      success: true,
      data: transformedPortfolios,
      type: type,
      count: transformedPortfolios.length
    });
  } catch (error) {
    console.error('Error fetching portfolios by type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolios by type',
      error: error.message
    });
  }
});

// @route   GET /api/portfolios/stats
// @desc    Get portfolio statistics
// @access  Public
router.get('/statistics/overview', async (req, res) => {
  try {
    const stats = await Portfolio.getStatistics();
    
    res.json({
      success: true,
      data: {
        totalPortfolios: parseInt(stats.totalPortfolios) || 0,
        totalSubscribers: parseInt(stats.totalSubscribers) || 0,
        totalVolume: parseFloat(stats.totalVolume) || 0,
        totalReturns: parseFloat(stats.totalReturns) || 0,
        avgDailyROI: parseFloat(stats.avgDailyROI) || 0,
        portfolioBreakdown: {
          basic: parseInt(stats.basicCount) || 0,
          premium: parseInt(stats.premiumCount) || 0,
          elite: parseInt(stats.eliteCount) || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio statistics',
      error: error.message
    });
  }
});

module.exports = router;