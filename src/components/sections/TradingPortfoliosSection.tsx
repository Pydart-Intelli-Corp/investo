'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, TrendingUp, Zap, Shield, Rocket, Target, Wallet, Crown } from 'lucide-react';

const TradingPortfoliosSection = () => {
  const portfolios = [
    {
      name: "Basic Pack (30-Day)",
      dailyPnl: "1.0%/day",
      portfolioRange: "$100 - $5,000",
      duration: "30 days",
      capitalReturned: true,
      aiImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center",
      gradient: "from-green-500 to-emerald-500",
      description: "AI arbitrage engine with consistent daily returns",
      features: ["AI Arbitrage", "Auto Trading", "Daily Compounding"],
      totalReturn: "300% total",
      profitLimit: "3x limit"
    },
    {
      name: "Basic Pack (365-Day)",
      dailyPnl: "1.25%/day",
      portfolioRange: "$100 - $5,000",
      duration: "365 days",
      capitalReturned: true,
      aiImage: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop&crop=center",
      gradient: "from-green-600 to-teal-500",
      description: "Extended AI trading with enhanced daily returns",
      features: ["Enhanced ROI", "Long-term Growth", "Capital Protection"],
      totalReturn: "300% total",
      profitLimit: "3x limit"
    },
    {
      name: "Premium Pack (30-Day)",
      dailyPnl: "1.5%/day",
      portfolioRange: "$5,001 - $25,000",
      duration: "30 days",
      capitalReturned: true,
      aiImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop&crop=center",
      gradient: "from-purple-500 to-pink-500",
      description: "Premium AI algorithms with higher profit margins",
      features: ["Premium Algorithms", "Priority Execution", "Advanced Analytics"],
      totalReturn: "350% total",
      profitLimit: "3.5x limit"
    },
    {
      name: "Premium Pack (365-Day)",
      dailyPnl: "1.75%/day",
      portfolioRange: "$5,001 - $25,000",
      duration: "365 days",
      capitalReturned: true,
      aiImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&crop=center",
      gradient: "from-purple-600 to-violet-500",
      description: "Extended premium trading with maximized returns",
      features: ["Maximum ROI", "Premium Support", "Exclusive Features"],
      totalReturn: "350% total",
      profitLimit: "3.5x limit"
    },
    {
      name: "Elite Pack (30-Day)",
      dailyPnl: "2.0%/day",
      portfolioRange: "$25,001+",
      duration: "30 days",
      capitalReturned: true,
      aiImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&crop=center",
      gradient: "from-yellow-500 to-orange-500",
      description: "Elite AI trading for high-value investors",
      features: ["Elite Algorithms", "VIP Support", "Highest Returns"],
      totalReturn: "400% total",
      profitLimit: "4x limit",
      isElite: true,
      subscriptionFee: "$25",
      walletInfo: "USDT (BEP20) Binance"
    },
    {
      name: "Elite Pack (365-Day)",
      dailyPnl: "2.25%/day",
      portfolioRange: "$25,001+",
      duration: "365 days",
      capitalReturned: true,
      aiImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&crop=center",
      gradient: "from-yellow-600 to-red-500",
      description: "Ultimate AI trading experience with maximum profitability",
      features: ["Ultimate ROI", "White-glove Service", "Elite Features"],
      totalReturn: "400% total",
      profitLimit: "4x limit",
      isElite: true,
      subscriptionFee: "$25",
      walletInfo: "USDT (BEP20) Binance"
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            AI-Arbitrage Trading Plans
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Choose from our smart AI arbitrage trading portfolios designed to generate consistent passive income 
            through automated bot operations. Start with our annual subscription and select your investment tier.
          </p>
        </motion.div>

        {/* Portfolio Cards Grid */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {portfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`relative bg-gradient-to-br ${portfolio.gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-white/50 p-1 h-full`}>
                <div className="bg-white rounded-xl h-full flex flex-col">
                  {/* AI Image Header */}
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <Image
                      src={portfolio.aiImage}
                      alt={`AI visualization for ${portfolio.name}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${portfolio.gradient} opacity-60 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    {/* Floating Badge */}
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${portfolio.gradient} backdrop-blur-sm rounded-full px-3 py-1 shadow-lg`}>
                      <span className="text-white text-sm font-bold">{portfolio.duration}</span>
                    </div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{portfolio.name}</h3>
                      <p className="text-white/95 text-sm drop-shadow">{portfolio.description}</p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-3 text-center border border-green-200`}>
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-xs text-green-700 font-medium">Daily ROI</span>
                        </div>
                        <div className="font-bold text-green-700">{portfolio.dailyPnl}</div>
                      </div>
                      <div className={`bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-3 text-center border border-blue-200`}>
                        <div className="flex items-center justify-center mb-1">
                          <Shield className="w-4 h-4 text-blue-600 mr-1" />
                          <span className="text-xs text-blue-700 font-medium">Range</span>
                        </div>
                        <div className="font-bold text-blue-700 text-sm">{portfolio.portfolioRange}</div>
                      </div>
                    </div>

                    {/* Profit Limit and Total Return */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3 text-center border border-purple-200`}>
                        <div className="flex items-center justify-center mb-1">
                          <Target className="w-4 h-4 text-purple-600 mr-1" />
                          <span className="text-xs text-purple-700 font-medium">Profit Limit</span>
                        </div>
                        <div className="font-bold text-purple-700 text-sm">{portfolio.profitLimit}</div>
                      </div>
                      <div className={`bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-3 text-center border border-yellow-200`}>
                        <div className="flex items-center justify-center mb-1">
                          <Rocket className="w-4 h-4 text-yellow-600 mr-1" />
                          <span className="text-xs text-yellow-700 font-medium">Total Return</span>
                        </div>
                        <div className="font-bold text-yellow-700 text-sm">{portfolio.totalReturn}</div>
                      </div>
                    </div>

                    {/* Elite Package Special Features */}
                    {portfolio.isElite && (
                      <div className="mb-4 space-y-3">
                        {/* Subscription Fee Highlight */}
                        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-lg p-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-400 text-amber-900 px-2 py-1 text-xs font-bold rounded-bl-lg">
                            ELITE
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <h4 className="text-amber-900 font-bold text-xs mb-1">Yearly Bot Subscription</h4>
                              <p className="text-amber-700 text-xs">One time fee: <span className="font-bold">{portfolio.subscriptionFee}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Wallet Information Highlight */}
                        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-lg p-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-2 py-1 text-xs font-bold rounded-bl-lg">
                            WALLET
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                              <Wallet className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <h4 className="text-blue-900 font-bold text-xs mb-1">Receive & Withdraw</h4>
                              <p className="text-blue-700 text-xs">{portfolio.walletInfo}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Features */}
                  <div className="my-4 flex-grow">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">AI Features</span>
                    </h4>
                    <div className="space-y-2">
                      {portfolio.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capital Return Badge */}
                  {portfolio.capitalReturned && (
                    <div className="mb-6">
                      <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Capital Returned
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/activate"
                        className={`block w-full text-center py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${portfolio.gradient} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
                      >
                        <span className="flex items-center justify-center">
                          <Rocket className="w-4 h-4 mr-2" />
                          Activate Portfolio
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>

                {/* Enhanced hover effects are handled by the gradient border and scaling */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your AI Trading Journey?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join thousands of traders who trust our AI-powered portfolios for consistent returns and intelligent market analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Get Started Now
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 border-2 border-blue-500 text-white bg-blue-500 font-semibold rounded-lg hover:bg-blue-600 hover:border-blue-600 transition-all transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TradingPortfoliosSection;