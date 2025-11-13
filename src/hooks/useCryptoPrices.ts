'use client';

import { useState, useEffect, useCallback } from 'react';
import { cryptoService } from '@/services/enhancedCryptoService';

interface CoinData {
  usd: number;
  usd_24h_change: number;
  usd_market_cap?: number;
  usd_24h_vol?: number;
}

interface PricesData {
  [key: string]: CoinData;
}

interface UseCryptoPricesReturn {
  prices: PricesData;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchPrices: () => Promise<void>;
  fetchTopCoins: (limit?: number) => Promise<void>;
}

const useCryptoPrices = (coinIds: string[] = [], updateInterval: number = 60000): UseCryptoPricesReturn => {
  const [prices, setPrices] = useState<PricesData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!coinIds.length) return;

    try {
      setError(null);
      const data = await cryptoService.fetchCryptoPrices(coinIds);
      setPrices(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [coinIds]);

  const fetchTopCoins = useCallback(async (limit: number = 10) => {
    try {
      setError(null);
      setLoading(true);
      const data = await cryptoService.fetchMarketData(limit);
      
      // Transform the data to match our expected format
      const transformedData: PricesData = {};
      data.forEach((coin: any) => {
        transformedData[coin.id] = {
          usd: coin.current_price,
          usd_24h_change: coin.price_change_percentage_24h,
          usd_market_cap: coin.market_cap,
          usd_24h_vol: coin.total_volume
        };
      });
      
      setPrices(transformedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching top coins:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    
    const interval = setInterval(fetchPrices, updateInterval);
    
    return () => clearInterval(interval);
  }, [fetchPrices, updateInterval]);

  return {
    prices,
    loading,
    error,
    lastUpdated,
    fetchPrices,
    fetchTopCoins
  };
};

export default useCryptoPrices;