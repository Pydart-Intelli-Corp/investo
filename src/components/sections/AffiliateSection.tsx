'use client';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Network, Gift, Zap, Crown, Star } from 'lucide-react';
import Link from 'next/link';

const AffiliateSection = () => {
  const affiliateFeatures = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Direct Referral Bonus",
      description: "5% commission on every direct referral investment",
      gradient: "from-green-500 to-emerald-500",
      highlight: "5%"
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Team Level Bonuses",
      description: "Earn from 15 levels deep with dynamic structure",
      gradient: "from-blue-500 to-indigo-500",
      highlight: "15 Levels"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Recurring Income",
      description: "Commission on renewals and reinvestments",
      gradient: "from-purple-500 to-pink-500",
      highlight: "Recurring"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Community Builder",
      description: "Turn your network into passive income stream",
      gradient: "from-yellow-500 to-orange-500",
      highlight: "Passive"
    }
  ];

  const levelStructure = [
    { level: "Level 1", percentage: "5%", description: "Direct Referrals" },
    { level: "Level 2-5", percentage: "2%", description: "Secondary Network" },
    { level: "Level 6-10", percentage: "1%", description: "Extended Network" },
    { level: "Level 11-15", percentage: "0.5%", description: "Deep Network" }
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Affiliate Program
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            BTC BOT 24 rewards community builders through a multi-level affiliate income system. 
            Build your network and earn passive income from every referral investment and renewal.
          </p>
        </motion.div>

        {/* Affiliate Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
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
                <div className="bg-white rounded-xl p-6 h-full">
                  {/* Highlight Badge */}
                  <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${feature.gradient} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {feature.highlight}
                  </div>

                  {/* Icon */}
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient} mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-center leading-relaxed">
                    {feature.description}
                  </p>
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
              Multi-Level Commission Structure
              <Star className="w-6 h-6 ml-3" />
            </h3>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {levelStructure.map((level, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 text-center border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="text-2xl font-bold text-blue-600 mb-2">{level.percentage}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">{level.level}</div>
                  <div className="text-gray-600 text-sm">{level.description}</div>
                </div>
              ))}
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
              How the Affiliate Program Works
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Share Your Referral Link</h4>
                  <p className="text-gray-700">Get your unique affiliate link and start sharing with your network.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">People Join & Invest</h4>
                  <p className="text-gray-700">When someone signs up and invests using your link, you earn commission.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Earn Recurring Income</h4>
                  <p className="text-gray-700">Continue earning from renewals and deep-level network activities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-8 border border-gray-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Build Your Network</h4>
                <p className="text-gray-700 mb-6">Transform your connections into a sustainable income stream</p>
                <div className="bg-white rounded-lg p-4 shadow-inner">
                  <div className="text-3xl font-bold text-green-600 mb-2">$10,000+</div>
                  <div className="text-gray-600">Monthly Potential</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce delay-75 shadow-lg"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AffiliateSection;
