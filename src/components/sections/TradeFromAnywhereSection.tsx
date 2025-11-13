'use client';

import { useState, useEffect } from 'react';
import { Globe, MapPin, Smartphone, Wifi } from 'lucide-react';

const TradeFromAnywhereSection = () => {
  const [activeCity, setActiveCity] = useState(0);

  const cities = [
    { name: 'New York', timezone: 'EST', time: '14:30', active: true },
    { name: 'London', timezone: 'GMT', time: '19:30', active: true },
    { name: 'Tokyo', timezone: 'JST', time: '03:30', active: true },
    { name: 'Sydney', timezone: 'AEST', time: '05:30', active: true },
    { name: 'Dubai', timezone: 'GST', time: '23:30', active: true },
    { name: 'Hong Kong', timezone: 'HKT', time: '02:30', active: true }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCity((prev) => (prev + 1) % cities.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [cities.length]);

  return (
    <section className="bg-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Trade From Anywhere
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Whether you&apos;re at home or on the go, seize market opportunities anytime,
            anywhere, and secure your financial future effortlessly. Trade from any and every city.
          </p>
        </div>

        {/* Global Trading Visualization */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Central Globe */}
          <div className="relative flex items-center justify-center">
            {/* Rotating Semi-circles */}
            <div className="relative w-96 h-96 flex items-center justify-center">
              {/* First Semi-circle */}
              <div className="absolute w-full h-full">
                <div className="w-full h-full border-4 border-blue-300 border-dashed rounded-full animate-spin-slow"></div>
              </div>
              
              {/* Second Semi-circle */}
              <div className="absolute w-80 h-80">
                <div className="w-full h-full border-3 border-purple-300 border-dashed rounded-full animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '30s'}}></div>
              </div>
              
              {/* Third Semi-circle */}
              <div className="absolute w-64 h-64">
                <div className="w-full h-full border-2 border-green-300 border-dashed rounded-full animate-spin-slow" style={{animationDuration: '40s'}}></div>
              </div>

              {/* Central Globe Icon */}
              <div className="relative z-10 w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <Globe className="w-16 h-16 text-white" />
              </div>

              {/* City Indicators */}
              {cities.map((city, index) => {
                const angle = (index * 60) - 90; // Distribute cities around circle
                const radius = 140;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                return (
                  <div
                    key={index}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                      activeCity === index ? 'scale-125 z-20' : 'scale-100 z-10'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`
                    }}
                  >
                    <div className={`relative p-3 rounded-xl shadow-lg transition-all duration-500 ${
                      activeCity === index 
                        ? 'bg-blue-600 text-white scale-110' 
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <div className="text-sm">
                          <div className="font-semibold">{city.name}</div>
                          <div className="text-xs opacity-75">{city.time}</div>
                        </div>
                      </div>
                      
                      {/* Active indicator */}
                      {activeCity === index && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Mobile Trading</h3>
            <p className="text-gray-700">
              Execute trades seamlessly from your smartphone with our advanced mobile platform.
            </p>
          </div>

          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wifi className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Connectivity</h3>
            <p className="text-gray-700">
              Stay connected to global markets around the clock with real-time data streaming.
            </p>
          </div>

          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Global Markets</h3>
            <p className="text-gray-700">
              Access international markets and trade across multiple time zones effortlessly.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
            <div className="text-gray-600 text-sm">Countries</div>
          </div>
          
          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">Trading</div>
          </div>
          
          <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600 text-sm">Uptime</div>
          </div>
          
          <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">0.1s</div>
            <div className="text-gray-600 text-sm">Latency</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeFromAnywhereSection;