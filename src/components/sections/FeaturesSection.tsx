import { TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <TrendingUp className="w-12 h-12 text-white" />,
      title: "AI-Powered Arbitrage",
      description: "Continuously scans multiple exchanges to detect price differences for digital assets like BTC, USDT, and gold-backed tokens.",
      gradient: "from-green-500 to-emerald-600",
      borderColor: "border-green-200 hover:border-green-400",
      bgGradient: "from-green-400 to-blue-500"
    },
    {
      icon: <Shield className="w-12 h-12 text-white" />,
      title: "Instant Execution",
      description: "Executes simultaneous buy-sell orders whenever a price gap is detected — locking in profit before markets rebalance.",
      gradient: "from-purple-500 to-pink-600",
      borderColor: "border-purple-200 hover:border-purple-400",
      bgGradient: "from-purple-400 to-pink-500"
    },
    {
      icon: <Zap className="w-12 h-12 text-white" />,
      title: "Automated Growth",
      description: "Returns are credited directly to your trading account with profits compounding daily for maximum growth potential.",
      gradient: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-200 hover:border-blue-400",
      bgGradient: "from-blue-400 to-indigo-500"
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            How BTC BOT 24 Works
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Our next-generation AI Arbitrage Trading Platform enables investors to earn consistent 
            passive income through automated trading bots and real-time market analysis.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              <div className={`relative bg-white p-8 rounded-2xl border-2 ${feature.borderColor} transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl`}>
                {/* Icon Container */}
                <div className="mb-6 flex justify-center">
                  <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Action Indicator */}
                <div className="mt-6 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-75 duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-12 h-px bg-gray-300"></div>
            <span className="text-sm font-medium">POWERED BY AI</span>
            <div className="w-12 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;