import Link from 'next/link';
import { Sparkles, TrendingUp, Target, Zap, Database, Compass, Users, Cog } from 'lucide-react';

const WhyChooseSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Cutting-Edge",
      subtitle: "Precision"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trendsetter",
      subtitle: "Advantage"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Adaptive Excellence"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Seamless Profits"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data-Driven Triumph"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Market Pioneer"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Strategic Partner"
    },
    {
      icon: <Cog className="w-8 h-8" />,
      title: "Automated Mastery"
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Why Choose <span className="text-blue-600">Investogold</span>?
          </h2>
          <p className="text-gray-800 text-lg max-w-4xl mx-auto leading-relaxed">
            Investogold doesn&apos;t just follow trends - it pioneers them. It empowers traders to
            navigate both bullish and bearish market conditions with unwavering confidence.
            By leveraging sophisticated algorithms and real-time data streams, Investogold
            adapts to ever-changing market dynamics, seizing opportunities while minimizing
            risks.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:transform hover:scale-105 text-center shadow-sm hover:shadow-md"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                {feature.subtitle && (
                  <p className="text-gray-800 text-sm font-medium">
                    {feature.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;