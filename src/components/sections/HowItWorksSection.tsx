import { UserPlus, DollarSign, Play, Banknote } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      icon: <UserPlus className="w-12 h-12" />,
      title: "Register",
      description: "Create your account in minutes with our simple registration process. Verify your identity and get started."
    },
    {
      step: 2,
      icon: <DollarSign className="w-12 h-12" />,
      title: "Deposit Funds",
      description: "Fund your account securely with multiple payment options. Choose your preferred deposit method."
    },
    {
      step: 3,
      icon: <Play className="w-12 h-12" />,
      title: "Activate",
      description: "Select and activate your preferred AI trading portfolio. Set your risk preferences and start trading."
    },
    {
      step: 4,
      icon: <Banknote className="w-12 h-12" />,
      title: "Withdraw",
      description: "Enjoy your profits! Withdraw your earnings anytime with our fast and secure withdrawal process."
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            Our user-friendly interface and intuitive features ensure that even newcomers
            can quickly grasp the essentials and embark on a seamless journey into the world
            of efficient and profitable trading.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((stepData, index) => (
            <div key={index} className="relative group">
              {/* Connection Line (Hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 z-0"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 text-center group z-10 shadow-lg">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {stepData.step}
                </div>

                {/* Icon */}
                <div className="text-blue-600 group-hover:text-blue-500 transition-colors mb-6 flex justify-center mt-4">
                  <div className="p-4 bg-gray-100 rounded-full group-hover:bg-gray-50 transition-all duration-300">
                    {stepData.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  Step {stepData.step}: {stepData.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {stepData.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-75"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Trading Journey?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Join thousands of successful traders who have already discovered the power of AI-driven trading. 
            Start with as little as $200 and watch your portfolio grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              Get Started Now
            </button>
            <button className="px-8 py-4 border-2 border-blue-500 text-white bg-blue-500 font-semibold rounded-lg hover:bg-blue-600 hover:border-blue-600 transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        {/* Section Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500"></div>
            <span className="text-sm font-medium">MARKET DATA</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;