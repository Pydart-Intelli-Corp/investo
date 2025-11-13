'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Flame, Star } from 'lucide-react';

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change_24h: string;
  change_7d: string;
  volume: string;
  rank: number;
  isPositive: boolean;
  is7dPositive: boolean;
  icon: string;
}

const TrendingCryptoSection = () => {
  const [isLiveData, setIsLiveData] = useState(false);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([
    { 
      id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '$111,257', 
      change_24h: '+2.65%', change_7d: '+8.2%', volume: '$54.2B', rank: 1,
      isPositive: true, is7dPositive: true, icon: '₿'
    },
    { 
      id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '$4,015', 
      change_24h: '+1.8%', change_7d: '+5.4%', volume: '$32.1B', rank: 2,
      isPositive: true, is7dPositive: true, icon: 'Ξ'
    },
    { 
      id: 'solana', name: 'Solana', symbol: 'SOL', price: '$248', 
      change_24h: '+12.4%', change_7d: '+18.9%', volume: '$8.7B', rank: 5,
      isPositive: true, is7dPositive: true, icon: '◉'
    }
  ]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        console.log('🔥 Fetching trending crypto data...');
        
        // Add significant delay to coordinate with other API calls
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Fetch trending coins from CoinGecko
        const trendingResponse = await fetch(
          'https://api.coingecko.com/api/v3/search/trending'
        );
        
        if (!trendingResponse.ok) {
          if (trendingResponse.status === 429) {
            console.warn('⚠️ Rate limit reached for trending data, using fallback');
            setIsLiveData(false);
            return;
          }
          throw new Error(`Trending API Error: ${trendingResponse.status}`);
        }

        const trendingData = await trendingResponse.json();
        console.log('🔥 Trending API Response:', trendingData);

        // Check if we have trending data
        if (!trendingData.coins || trendingData.coins.length === 0) {
          console.warn('⚠️ No trending data available, using fallback');
          setIsLiveData(false);
          return;
        }

        // Add another delay before the second API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get detailed data for trending coins
        const coinIds = trendingData.coins.slice(0, 6).map((coin: any) => coin.item.id).join(',');
        const detailResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false&price_change_percentage=24h%2C7d`
        );

        if (!detailResponse.ok) {
          if (detailResponse.status === 429) {
            console.warn('⚠️ Rate limit reached for trending details, using simplified data');
            // Use basic trending data without detailed prices
            const simplifiedTrending: TrendingCoin[] = trendingData.coins.slice(0, 6).map((item: any, index: number) => ({
              id: item.item.id,
              name: item.item.name,
              symbol: item.item.symbol.toUpperCase(),
              price: 'Rate Limited',
              change_24h: '0.0%',
              change_7d: '0.0%',
              volume: 'N/A',
              rank: item.item.market_cap_rank || index + 1,
              isPositive: false,
              is7dPositive: false,
              icon: '🔥'
            }));
            
            setTrendingCoins(simplifiedTrending);
            setIsLiveData(false);
            return;
          }
          throw new Error(`Detail API Error: ${detailResponse.status}`);
        }

        const detailData = await detailResponse.json();
        console.log('📊 Trending Detail Data:', detailData);

        const iconMapping: {[key: string]: string} = {
          'BTC': '₿', 'ETH': 'Ξ', 'BNB': '🔶', 'XRP': '◆', 'SOL': '◉',
          'DOGE': '🐕', 'ADA': '₳', 'AVAX': '🔺', 'MATIC': '🔷', 'DOT': '●',
          'LINK': '🔗', 'SHIB': '🐕', 'LTC': 'Ł', 'UNI': '🦄', 'ATOM': '⚛️'
        };

        const formatPrice = (price: number): string => {
          if (price < 0.01) return `$${price.toFixed(6)}`;
          if (price < 1) return `$${price.toFixed(4)}`;
          if (price < 100) return `$${price.toFixed(2)}`;
          return `$${Math.round(price).toLocaleString()}`;
        };

        const formatChange = (change: number): string => {
          const sign = change >= 0 ? '+' : '';
          return `${sign}${change.toFixed(1)}%`;
        };

        const formatVolume = (volume: number): string => {
          if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
          if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
          return `$${(volume / 1e3).toFixed(1)}K`;
        };

        const updatedTrending: TrendingCoin[] = detailData.map((coin: any, index: number) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: formatPrice(coin.current_price),
          change_24h: formatChange(coin.price_change_percentage_24h || 0),
          change_7d: formatChange(coin.price_change_percentage_7d_in_currency || 0),
          volume: formatVolume(coin.total_volume),
          rank: coin.market_cap_rank || index + 1,
          isPositive: (coin.price_change_percentage_24h || 0) >= 0,
          is7dPositive: (coin.price_change_percentage_7d_in_currency || 0) >= 0,
          icon: iconMapping[coin.symbol.toUpperCase()] || '🔥'
        }));

        console.log('🔥 Updated trending data:', updatedTrending);
        setTrendingCoins(updatedTrending);
        setIsLiveData(true);
      } catch (error) {
        console.error('❌ Error fetching trending data:', error);
        setIsLiveData(false);
      }
    };

    // Initial fetch
    setTimeout(fetchTrendingData, 3000);
    
    // Update every 2 minutes for trending data
    const interval = setInterval(fetchTrendingData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-orange-500" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Trending Now
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isLiveData ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isLiveData ? '🟢 LIVE' : '🟡 DEMO'}
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the hottest cryptocurrencies gaining momentum in the market right now
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCoins.map((coin, index) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl font-bold">
                    {coin.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{coin.name}</h3>
                    <p className="text-gray-600 text-sm">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">#{coin.rank}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{coin.price}</span>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      coin.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.isPositive ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                      {coin.change_24h}
                    </div>
                    <div className="text-xs text-gray-500">24h</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-600">7d Change</div>
                    <div className={`font-medium ${
                      coin.is7dPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.change_7d}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Volume</div>
                    <div className="font-medium text-gray-900">{coin.volume}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            View All Trending Coins
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingCryptoSection;