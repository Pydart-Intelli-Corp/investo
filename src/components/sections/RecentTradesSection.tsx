'use client';

import { useEffect, useState } from 'react';

const RecentTradesSection = () => {
  const [currentTime, setCurrentTime] = useState('11:30:10 AM');

  const trades = [
    { pair: 'BATUSDT', amount: '$9,131.13', change: '+2.11%', isPositive: true },
    { pair: 'DASHUSDT', amount: '$498.11', change: '-1.13%', isPositive: false },
    { pair: 'RENUSDT', amount: '$6,796.20', change: '+5.33%', isPositive: true },
    { pair: 'LPTUSDT', amount: '$331.20', change: '-0.25%', isPositive: false },
    { pair: 'OCEANUSDT', amount: '$4,243.20', change: '+3.17%', isPositive: true },
    { pair: 'CELOUSDT', amount: '$6,693.33', change: '+4.25%', isPositive: true },
    { pair: 'VOXELUSDT', amount: '$9,327.33', change: '+4.14%', isPositive: true },
    { pair: 'ALICEUSDT', amount: '$7,466.33', change: '+1.20%', isPositive: true },
    { pair: 'LTCUSDT', amount: '$5,366.13', change: '+2.13%', isPositive: true },
    { pair: 'BTCUSDT', amount: '$121,598.00', change: '+1.25%', isPositive: true },
    { pair: 'ETHUSDT', amount: '$4,367.72', change: '-0.87%', isPositive: false },
    { pair: 'BNBUSDT', amount: '$1,271.17', change: '+0.95%', isPositive: true },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Recent Trades by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Investogold</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Real-time trading activity powered by our AI algorithms. Watch as Investogold 
            executes precision trades across multiple cryptocurrency pairs.
          </p>
        </div>

        {/* Trading Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 font-semibold text-lg">Live Trading Feed</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 text-sm font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Trades List */}
          <div className="max-h-96 overflow-y-auto">
            {trades.map((trade, index) => (
              <div 
                key={index}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Time */}
                <div className="text-gray-500 text-sm font-mono min-w-[100px]">
                  {currentTime}
                </div>

                {/* Trading Pair */}
                <div className="text-gray-900 font-semibold text-left min-w-[120px]">
                  {trade.pair}
                </div>

                {/* Amount */}
                <div className="text-gray-900 font-bold text-right min-w-[120px]">
                  {trade.amount}
                </div>

                {/* Change */}
                <div className={`font-semibold text-right min-w-[80px] ${
                  trade.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trade.change}
                </div>

                {/* Trade Icon */}
                <div className="min-w-[40px] flex justify-center">
                  {trade.isPositive ? (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">↗</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs">↘</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Trades are updated in real-time • AI-powered execution • Risk-optimized positions
            </p>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">94.7%</div>
            <div className="text-gray-500">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-500">Active Trading</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0.001s</div>
            <div className="text-gray-500">Execution Speed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">15+</div>
            <div className="text-gray-500">Trading Pairs</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentTradesSection;