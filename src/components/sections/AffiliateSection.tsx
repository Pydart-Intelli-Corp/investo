'use client';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Network, Gift, Zap, Crown, Star } from 'lucide-react';
import Link from 'next/link';

const AffiliateSection = () => {
  const affiliateFeatures = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Level 1 – Direct Referral",
      description: "Earn 10% commission on direct referrals' investments",
      gradient: "from-green-500 to-emerald-500",
      highlight: "10%",
      example: "Friend invests $1,000 → You earn $100"
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Level 2 Referral",
      description: "Earn 5% when your referral brings someone",
      gradient: "from-blue-500 to-cyan-500",
      highlight: "5%",
      example: "Level 2 invests $1,000 → You earn $50"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Level 3 Referral",
      description: "Earn 3% from third level investments",
      gradient: "from-purple-500 to-violet-500",
      highlight: "3%",
      example: "Level 3 invests $1,000 → You earn $30"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Level 4 Referral",
      description: "Earn 2% from fourth level investments",
      gradient: "from-amber-500 to-orange-500",
      highlight: "2%",
      example: "Level 4 invests $1,000 → You earn $20"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Level 5 Referral",
      description: "Earn 1% from fifth level investments",
      gradient: "from-red-500 to-pink-500",
      highlight: "1%",
      example: "Level 5 invests $1,000 → You earn $10"
    }
  ];

  const levelStructure = [
    { level: "Level 1", percentage: "10%", description: "Direct Referral", color: "from-green-500 to-emerald-500" },
    { level: "Level 2", percentage: "5%", description: "Second Generation", color: "from-blue-500 to-cyan-500" },
    { level: "Level 3", percentage: "3%", description: "Third Generation", color: "from-purple-500 to-violet-500" },
    { level: "Level 4", percentage: "2%", description: "Fourth Generation", color: "from-amber-500 to-orange-500" },
    { level: "Level 5", percentage: "1%", description: "Fifth Generation", color: "from-red-500 to-pink-500" }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
              5-Level Referral Commission System
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Build your investment network and earn commissions up to 5 levels deep. 
            The more your network grows, the more passive income you generate automatically.
          </p>
        </motion.div>

        {/* Affiliate Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {affiliateFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`relative bg-gradient-to-br ${feature.gradient} p-1 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500`}>
                <div className="bg-white rounded-xl p-5 h-full">
                  {/* Highlight Badge */}
                  <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${feature.gradient} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {feature.highlight}
                  </div>

                  {/* Icon */}
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient} mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-center text-sm leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  
                  {/* Example */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-2 border border-gray-200">
                    <p className="text-xs text-gray-600 text-center font-medium">{feature.example}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Level Structure */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6">
            <h3 className="text-2xl font-bold text-center flex items-center justify-center">
              <Star className="w-6 h-6 mr-3" />
              5-Level Commission Breakdown
              <Star className="w-6 h-6 ml-3" />
            </h3>
            <p className="text-center text-blue-100 mt-2">Earn from every investment in your network</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {levelStructure.map((level, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${level.color} text-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                >
                  <div className="text-4xl font-bold mb-2">{level.percentage}</div>
                  <div className="text-lg font-semibold mb-2">{level.level}</div>
                  <div className="text-sm opacity-90">{level.description}</div>
                </div>
              ))}
            </div>
            
            {/* Example Calculation */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">💰 Total Earning Example</h4>
              <p className="text-gray-700 text-center mb-4">
                If each person in your 5-level network invests <span className="font-bold text-green-600">$1,000</span>:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center mb-4">
                <div className="bg-white rounded-lg p-3 shadow">
                  <div className="text-green-600 font-bold">Level 1</div>
                  <div className="text-2xl font-bold text-gray-900">$100</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow">
                  <div className="text-blue-600 font-bold">Level 2</div>
                  <div className="text-2xl font-bold text-gray-900">$50</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow">
                  <div className="text-purple-600 font-bold">Level 3</div>
                  <div className="text-2xl font-bold text-gray-900">$30</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow">
                  <div className="text-amber-600 font-bold">Level 4</div>
                  <div className="text-2xl font-bold text-gray-900">$20</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow">
                  <div className="text-red-600 font-bold">Level 5</div>
                  <div className="text-2xl font-bold text-gray-900">$10</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full shadow-lg">
                  <span className="text-sm font-medium">Total Commission: </span>
                  <span className="text-2xl font-bold">$210</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              How the 5-Level System Works
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Share Your Referral Link</h4>
                  <p className="text-gray-700">Get your unique referral code and invite friends to invest with InvestoGold.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Earn 10% Direct Commission</h4>
                  <p className="text-gray-700">When your referral invests, you instantly earn 10% commission on their investment amount.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Build Your Network</h4>
                  <p className="text-gray-700">Your referrals can refer others, and you earn from 5 levels deep automatically.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Passive Income Stream</h4>
                  <p className="text-gray-700">Earn commissions from all levels every time someone in your network invests.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl p-8 border border-gray-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Build Your Income Network</h4>
                <p className="text-gray-700 mb-6">Transform your network into a sustainable passive income source</p>
                <div className="bg-white rounded-lg p-6 shadow-lg mb-4">
                  <div className="text-sm text-gray-600 mb-2">Example Monthly Potential</div>
                  <div className="text-4xl font-bold text-green-600 mb-1">$5,000+</div>
                  <div className="text-xs text-gray-500">Based on active 5-level network</div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="bg-green-100 rounded p-2">
                    <div className="font-bold text-green-700">L1</div>
                    <div className="text-gray-600">10%</div>
                  </div>
                  <div className="bg-blue-100 rounded p-2">
                    <div className="font-bold text-blue-700">L2</div>
                    <div className="text-gray-600">5%</div>
                  </div>
                  <div className="bg-purple-100 rounded p-2">
                    <div className="font-bold text-purple-700">L3</div>
                    <div className="text-gray-600">3%</div>
                  </div>
                  <div className="bg-amber-100 rounded p-2">
                    <div className="font-bold text-amber-700">L4</div>
                    <div className="text-gray-600">2%</div>
                  </div>
                  <div className="bg-red-100 rounded p-2">
                    <div className="font-bold text-red-700">L5</div>
                    <div className="text-gray-600">1%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce delay-75 shadow-lg"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AffiliateSection;
