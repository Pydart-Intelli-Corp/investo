import { TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <TrendingUp className="w-12 h-12 text-white" />,
      title: "AI-Driven Trading",
      description: "Automated arbitrage and market-intelligence strategies across gold and commodity markets. Monthly performance targets of 7-10% through disciplined execution.",
      gradient: "from-yellow-500 to-amber-600",
      borderColor: "border-yellow-200 hover:border-yellow-400",
      bgGradient: "from-yellow-400 to-amber-500"
    },
    {
      icon: <Shield className="w-12 h-12 text-white" />,
      title: "Physical Gold Assets",
      description: "Secure investment in physical gold stored in accredited UAE vaults. Fully insured with transparent ownership and 12-15% annual premium plus price appreciation.",
      gradient: "from-amber-500 to-yellow-600",
      borderColor: "border-amber-200 hover:border-amber-400",
      bgGradient: "from-amber-400 to-yellow-500"
    },
    {
      icon: <Zap className="w-12 h-12 text-white" />,
      title: "High-Performance Strategy",
      description: "Weekly arbitrage program with rapid multi-exchange execution. Target 3-5% weekly returns through professionally monitored active trading strategies.",
      gradient: "from-orange-500 to-red-600",
      borderColor: "border-orange-200 hover:border-orange-400",
      bgGradient: "from-orange-400 to-red-500"
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Why InvestoGold?
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Smart technology-driven approach to wealth creation through gold and commodities — supported by real assets, 
            professional market management, and regulated operations in Dubai, UAE.
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