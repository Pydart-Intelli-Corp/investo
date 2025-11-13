'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PaymentScreen from './PaymentScreen';
import { 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Rocket, 
  Crown,
  ArrowRight,
  Clock,
  DollarSign,
  AlertCircle,
  Loader2,
  Wallet
} from 'lucide-react';

interface FeatureObject {
  name: string;
  description?: string;
  included?: boolean;
}

interface Portfolio {
  id: number;
  name: string;
  description: string;
  dailyPnl: string;
  portfolioRange: string;
  duration: string;
  gradient: string;
  features: (string | FeatureObject)[];
  totalReturn: string;
  profitLimit: string;
  type: string;
  category: string;
  isElite: boolean;
  subscriptionFee: string | null;
  walletInfo: string | null;
  minInvestment: number;
  maxInvestment: number;
  dailyROI: number;
  requiresSubscription: boolean;
  availabilityStatus: string;
  remainingSlots: number;
  totalSubscribers: number;
  activeSubscribers: number;
}



interface DashboardPlansProps {
  onClose?: () => void;
  showHeader?: boolean;
}

const DashboardPlans: React.FC<DashboardPlansProps> = ({ onClose, showHeader = true }) => {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(0);

  useEffect(() => {
    fetchPortfolios();
  }, []);



  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolios');
      const data = await response.json();

      if (data.success) {
        setPortfolios(data.data);
      } else {
        setError(data.message || 'Failed to fetch portfolios');
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setError('Failed to load portfolios. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (portfolio: Portfolio) => {
    // For now, use minimum investment amount
    // In a real app, you'd have an investment amount selector
    const defaultInvestment = portfolio.minInvestment || 100;
    
    setSelectedPortfolio(portfolio);
    setInvestmentAmount(defaultInvestment);
    setShowPayment(true);
  };

  const handleBackToPlans = () => {
    setShowPayment(false);
    setSelectedPortfolio(null);
    setInvestmentAmount(0);
  };







  const getGradientColors = (gradient: string) => {
    const gradientMap: { [key: string]: string } = {
      'from-green-500 to-emerald-500': 'from-green-500 to-emerald-500',
      'from-green-600 to-teal-500': 'from-green-600 to-teal-500',
      'from-purple-500 to-pink-500': 'from-purple-500 to-pink-500',
      'from-purple-600 to-violet-500': 'from-purple-600 to-violet-500',
      'from-yellow-500 to-orange-500': 'from-yellow-500 to-orange-500',
      'from-yellow-600 to-red-500': 'from-yellow-600 to-red-500'
    };
    return gradientMap[gradient] || 'from-blue-500 to-purple-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 text-lg font-medium">Loading AI-Arbitrage Plans...</p>
          <p className="text-gray-500 text-sm">Analyzing market opportunities across 50+ exchanges</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Plans</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPortfolios}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show payment screen when a plan is selected
  if (showPayment && selectedPortfolio) {
    return (
      <PaymentScreen
        portfolio={selectedPortfolio}
        investmentAmount={investmentAmount}
        onBack={handleBackToPlans}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Only show when showHeader is true or undefined (default) */}
        {(showHeader === true || showHeader === undefined) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  AI-Powered Arbitrage Trading Plans
                </h1>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
                  Harness the power of artificial intelligence to capitalize on cryptocurrency price differences across multiple exchanges. 
                  Our advanced algorithms execute thousands of micro-trades 24/7, generating consistent returns through market inefficiencies.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 max-w-3xl mx-auto">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Real-time Market Analysis
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Multi-Exchange Integration
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Risk-Managed Trading
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Automated Profit Distribution
                  </div>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2"
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* How AI-Arbitrage Works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How AI-Arbitrage Trading Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our sophisticated AI system monitors price discrepancies across 50+ cryptocurrency exchanges, 
              executing profitable trades in milliseconds while you sleep.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Market Scanning</h3>
              <p className="text-sm text-gray-600">AI scans 50+ exchanges every millisecond for price differences</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Instant Execution</h3>
              <p className="text-sm text-gray-600">Automated buy/sell orders executed within 50-100 milliseconds</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Profit Capture</h3>
              <p className="text-sm text-gray-600">Price differences of 0.1-2% captured through simultaneous trades</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Daily Returns</h3>
              <p className="text-sm text-gray-600">Profits automatically credited to your account every 24 hours</p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Risk Management & Security</h4>
                <p className="text-blue-800 text-sm">
                  Our AI implements advanced risk management protocols including position sizing, stop-loss mechanisms, 
                  and real-time market volatility analysis. All funds are secured through institutional-grade cold storage 
                  and multi-signature wallets, with 24/7 monitoring and instant withdrawal capabilities.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`relative bg-gradient-to-br ${getGradientColors(portfolio.gradient)} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-white/50 p-1 h-full`}>
                <div className="bg-white rounded-xl h-full flex flex-col p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{portfolio.name}</h3>
                      {portfolio.isElite && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                          <Crown className="w-3 h-3 inline mr-1" />
                          ELITE
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{portfolio.description}</p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-3 text-center border border-green-200">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-700 font-medium">Daily Returns</span>
                      </div>
                      <div className="font-bold text-green-700">{portfolio.dailyPnl}</div>
                      <div className="text-xs text-green-600 mt-1">From Arbitrage</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-3 text-center border border-blue-200">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="text-xs text-blue-700 font-medium">Contract</span>
                      </div>
                      <div className="font-bold text-blue-700 text-sm">{portfolio.duration}</div>
                      <div className="text-xs text-blue-600 mt-1">AI Trading</div>
                    </div>
                  </div>

                  {/* AI Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-2 text-center border border-orange-200">
                      <div className="text-xs text-orange-700 font-medium">Exchanges</div>
                      <div className="font-bold text-orange-800 text-sm">50+</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-2 text-center border border-purple-200">
                      <div className="text-xs text-purple-700 font-medium">Speed</div>
                      <div className="font-bold text-purple-800 text-sm">50ms</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-2 text-center border border-cyan-200">
                      <div className="text-xs text-cyan-700 font-medium">Uptime</div>
                      <div className="font-bold text-cyan-800 text-sm">99.9%</div>
                    </div>
                  </div>

                  {/* Investment Range */}
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3 text-center border border-purple-200 mb-4">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-xs text-purple-700 font-medium">Capital Allocation</span>
                    </div>
                    <div className="font-bold text-purple-700 text-sm">{portfolio.portfolioRange}</div>
                    <div className="text-xs text-purple-600 mt-1">AI Managed Portfolio</div>
                  </div>

                  {/* Bot Subscription & Wallet Info - Available on All Plans */}
                  <div className="mb-4 space-y-3">
                    {/* Subscription Fee */}
                    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        {portfolio.isElite ? (
                          <Crown className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Zap className="w-4 h-4 text-amber-600" />
                        )}
                        <div>
                          <h4 className="text-amber-900 font-bold text-xs">Yearly Bot Subscription</h4>
                          <p className="text-amber-700 text-xs">One time fee: <span className="font-bold">$25</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Information */}
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Wallet className="w-4 h-4 text-blue-600" />
                        <div>
                          <h4 className="text-blue-900 font-bold text-xs">WALLET</h4>
                          <h5 className="text-blue-800 font-medium text-xs">Receive & Withdraw</h5>
                          <p className="text-blue-700 text-xs">USDT (BEP20) Binance</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 flex-grow">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                      AI-Arbitrage Features
                    </h4>
                    <div className="space-y-2">
                      {portfolio.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-900">
                              {typeof feature === 'string' ? feature : (feature as FeatureObject).name}
                            </span>
                            {typeof feature === 'object' && (feature as FeatureObject).description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {(feature as FeatureObject).description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Stats */}
                  <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="text-gray-500">Active Users</div>
                      <div className="font-bold text-gray-700">{portfolio.activeSubscribers}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500">Profit Limit</div>
                      <div className="font-bold text-gray-700">{portfolio.profitLimit}</div>
                    </div>
                  </div>

                  {/* Capital Return Badge */}
                  <div className="mb-4">
                    <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Capital Returned
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPlan(portfolio)}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${getGradientColors(portfolio.gradient)} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2`}
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Select Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
            ))}
        </div>

        {/* Additional Information Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          {/* Why AI-Arbitrage Works */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
              Why AI-Arbitrage Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Market Inefficiencies</h4>
                  <p className="text-gray-600 text-sm">Price differences between exchanges create consistent profit opportunities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">24/7 Automation</h4>
                  <p className="text-gray-600 text-sm">AI never sleeps, capturing opportunities in all time zones and markets</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Low Market Risk</h4>
                  <p className="text-gray-600 text-sm">Simultaneous buy/sell orders minimize exposure to market volatility</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Scalable Returns</h4>
                  <p className="text-gray-600 text-sm">Higher capital allocation leads to proportionally higher absolute returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Risk Management */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
              Security & Risk Management
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Institutional Security</h4>
                  <p className="text-gray-600 text-sm">Multi-signature wallets and cold storage protection</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Real-time Monitoring</h4>
                  <p className="text-gray-600 text-sm">24/7 system monitoring with instant alert capabilities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Position Limits</h4>
                  <p className="text-gray-600 text-sm">Automated position sizing prevents overexposure</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Instant Withdrawals</h4>
                  <p className="text-gray-600 text-sm">Access your funds anytime with immediate withdrawal processing</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Important Disclaimer</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI-Arbitrage trading involves financial risk. While our algorithms are designed to minimize risk through simultaneous 
                buy/sell orders, cryptocurrency markets can be volatile and unpredictable. Past performance does not guarantee future 
                results. Please invest responsibly and only with funds you can afford to lose. All trading involves risk of loss.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPlans;