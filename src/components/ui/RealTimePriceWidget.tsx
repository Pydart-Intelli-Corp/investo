'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Wifi, WifiOff } from 'lucide-react';
import { cryptoService, formatPrice, formatChange } from '@/services/enhancedCryptoService';

interface RealTimePriceWidgetProps {
  coinIds?: string[];
  displayCount?: number;
  updateInterval?: number;
  showTrend?: boolean;
  compact?: boolean;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d?: number;
  volume?: number;
  isLive: boolean;
}

const RealTimePriceWidget: React.FC<RealTimePriceWidgetProps> = ({
  coinIds = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'solana'],
  displayCount = 5,
  updateInterval = 30000,
  showTrend = true,
  compact = false
}) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [streamCleanup, setStreamCleanup] = useState<(() => void) | null>(null);

  useEffect(() => {
    const coinMapping: {[key: string]: {name: string, symbol: string}} = {
      'bitcoin': { name: 'Bitcoin', symbol: 'BTC' },
      'ethereum': { name: 'Ethereum', symbol: 'ETH' },
      'binancecoin': { name: 'BNB', symbol: 'BNB' },
      'ripple': { name: 'XRP', symbol: 'XRP' },
      'solana': { name: 'Solana', symbol: 'SOL' },
      'cardano': { name: 'Cardano', symbol: 'ADA' },
      'dogecoin': { name: 'Dogecoin', symbol: 'DOGE' },
      'avalanche-2': { name: 'Avalanche', symbol: 'AVAX' },
      'matic-network': { name: 'Polygon', symbol: 'MATIC' },
      'chainlink': { name: 'Chainlink', symbol: 'LINK' }
    };

    const cleanup = cryptoService.createPriceStream(coinIds, (data) => {
      try {
        console.log('📡 Received real-time price data:', data);
        
        const updatedData: PriceData[] = coinIds.slice(0, displayCount).map(coinId => {
          const coinData = data[coinId];
          const coinInfo = coinMapping[coinId];
          
          if (coinData && coinInfo) {
            return {
              id: coinId,
              name: coinInfo.name,
              symbol: coinInfo.symbol,
              price: coinData.usd,
              change24h: coinData.usd_24h_change || 0,
              change7d: coinData.usd_7d_change || 0,
              volume: coinData.usd_24h_vol || 0,
              isLive: true
            };
          }
          
          return {
            id: coinId,
            name: coinInfo?.name || 'Unknown',
            symbol: coinInfo?.symbol || 'UNK',
            price: 0,
            change24h: 0,
            isLive: false
          };
        });
        
        setPriceData(updatedData);
        setIsConnected(true);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error processing price stream:', error);
        setIsConnected(false);
      }
    });

    setStreamCleanup(() => cleanup);

    return () => {
      if (cleanup) cleanup();
    };
  }, [coinIds, displayCount]);

  const getConnectionStatus = () => {
    if (!lastUpdate) return { icon: WifiOff, color: 'text-gray-500', text: 'Connecting...' };
    
    const timeSinceUpdate = Date.now() - lastUpdate.getTime();
    if (timeSinceUpdate < updateInterval * 1.5) {
      return { icon: Wifi, color: 'text-green-500', text: 'Live' };
    } else {
      return { icon: WifiOff, color: 'text-red-500', text: 'Disconnected' };
    }
  };

  const connectionStatus = getConnectionStatus();

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Live Prices</h3>
          <div className="flex items-center gap-1">
            <connectionStatus.icon className={`w-4 h-4 ${connectionStatus.color}`} />
            <span className={`text-xs ${connectionStatus.color}`}>
              {connectionStatus.text}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <AnimatePresence>
            {priceData.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-700">{coin.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatPrice(coin.price)}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {coin.change24h >= 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {formatChange(coin.change24h)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold">Real-Time Prices</h3>
        </div>
        <div className="flex items-center gap-2">
          <connectionStatus.icon className={`w-5 h-5 ${connectionStatus.color}`} />
          <span className={`text-sm ${connectionStatus.color}`}>
            {connectionStatus.text}
          </span>
          {lastUpdate && (
            <span className="text-xs text-gray-400">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {priceData.map((coin, index) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{coin.name}</h4>
                  <p className="text-gray-300 text-sm">{coin.symbol}</p>
                </div>
                
                <div className="text-right">
                  <motion.div 
                    key={coin.price}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold"
                  >
                    {formatPrice(coin.price)}
                  </motion.div>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <div className={`flex items-center gap-1 ${
                      coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {coin.change24h >= 0 ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                      <span className="font-medium">{formatChange(coin.change24h)}</span>
                    </div>
                    
                    {showTrend && coin.change7d !== undefined && (
                      <div className={`text-sm ${
                        coin.change7d >= 0 ? 'text-green-300' : 'text-red-300'
                      }`}>
                        7d: {formatChange(coin.change7d)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-400">
        Powered by CoinGecko API • Updates every {updateInterval / 1000}s
      </div>
    </div>
  );
};

export default RealTimePriceWidget;