// Enhanced crypto service with smart caching and rate limiting
class CryptoDataService {
  private cache: Map<string, { data: any; timestamp: number; expiryTime: number }> = new Map();
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue: boolean = false;
  private readonly minRequestInterval = 1000; // 1 second between requests
  private readonly cacheExpiryTime = 45000; // 45 seconds cache

  constructor() {
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Queue request failed:', error);
        }
        
        // Wait minimum interval between requests
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
          await new Promise(resolve => 
            setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
          );
        }
        this.lastRequestTime = Date.now();
      }
    }
    
    this.isProcessingQueue = false;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiryTime) {
      console.log(`📦 Using cached data for ${key}`);
      return cached.data;
    }
    return null;
  }

  private setCacheData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiryTime: Date.now() + this.cacheExpiryTime
    });
  }

  async fetchCryptoPrices(coinIds: string[]): Promise<any> {
    const cacheKey = `prices_${coinIds.join(',')}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) return cached;

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          console.log('🚀 Fetching fresh crypto prices...');
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24h_vol=true`
          );

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          this.setCacheData(cacheKey, data);
          console.log('✅ Fresh crypto prices fetched and cached');
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  async fetchMarketData(limit: number = 24): Promise<any> {
    const cacheKey = `market_${limit}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) return cached;

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          console.log('🚀 Fetching fresh market data...');
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d&include_market_cap=true&include_24h_vol=true`
          );

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          this.setCacheData(cacheKey, data);
          console.log('✅ Fresh market data fetched and cached');
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  async fetchTrendingData(): Promise<any> {
    const cacheKey = 'trending';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) return cached;

    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          console.log('🚀 Fetching fresh trending data...');
          const response = await fetch(
            'https://api.coingecko.com/api/v3/search/trending'
          );

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          this.setCacheData(cacheKey, data);
          console.log('✅ Fresh trending data fetched and cached');
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  // WebSocket-like functionality using Server-Sent Events
  createPriceStream(coinIds: string[], callback: (data: any) => void): () => void {
    let isActive = true;
    
    const streamData = async () => {
      while (isActive) {
        try {
          const data = await this.fetchCryptoPrices(coinIds);
          if (isActive) {
            callback(data);
          }
        } catch (error) {
          console.error('Stream error:', error);
        }
        
        // Wait 30 seconds before next update
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    };
    
    streamData();
    
    // Return cleanup function
    return () => {
      isActive = false;
    };
  }

  // Get cache statistics
  getCacheStats(): { size: number; entries: Array<{ key: string; age: number }> } {
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp
    }));
    
    return {
      size: this.cache.size,
      entries
    };
  }

  // Clear expired cache entries
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now >= value.expiryTime) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cryptoService = new CryptoDataService();

// Utility functions for formatting
export const formatPrice = (price: number): string => {
  if (price < 0.000001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${Math.round(price).toLocaleString()}`;
};

export const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
  return `$${(marketCap / 1e3).toFixed(1)}K`;
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
  return `$${(volume / 1e3).toFixed(1)}K`;
};

export default cryptoService;