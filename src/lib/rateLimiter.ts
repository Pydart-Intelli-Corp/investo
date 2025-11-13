// Global API Rate Limiter for CoinGecko API
class CoinGeckoRateLimiter {
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing: boolean = false;
  private readonly minInterval = 2000; // 2 seconds between requests
  private readonly maxRetries = 3;
  private failedRequests: number = 0;
  private isRateLimited: boolean = false;
  private rateLimitResetTime: number = 0;

  constructor() {
    // Start processing queue
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      // Check if we're still rate limited
      if (this.isRateLimited && Date.now() < this.rateLimitResetTime) {
        console.log('⏳ Still rate limited, waiting...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          this.failedRequests = 0; // Reset on success
        } catch (error) {
          console.error('❌ Queued request failed:', error);
          this.failedRequests++;
          
          if (this.failedRequests >= this.maxRetries) {
            console.warn('⚠️ Max retries reached, implementing cooldown');
            this.isRateLimited = true;
            this.rateLimitResetTime = Date.now() + 60000; // 1 minute cooldown
          }
        }
        
        // Wait minimum interval between requests
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (timeSinceLastRequest < this.minInterval) {
          await new Promise(resolve => 
            setTimeout(resolve, this.minInterval - timeSinceLastRequest)
          );
        }
        this.lastRequestTime = Date.now();
      }
    }
    
    this.isProcessing = false;
  }

  async makeRequest(url: string, component: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestFn = async () => {
        try {
          console.log(`🚀 [${component}] Making API request to:`, url);
          
          const response = await fetch(url);
          
          if (!response.ok) {
            if (response.status === 429) {
              console.warn(`⚠️ [${component}] Rate limited (429)`);
              this.isRateLimited = true;
              this.rateLimitResetTime = Date.now() + 60000; // 1 minute cooldown
              throw new Error(`Rate Limited: ${response.status}`);
            }
            throw new Error(`API Error: ${response.status}`);
          }
          
          const data = await response.json();
          console.log(`✅ [${component}] API request successful`);
          
          // Reset rate limit status on successful request
          this.isRateLimited = false;
          this.rateLimitResetTime = 0;
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      this.requestQueue.push(requestFn);
      this.processQueue();
    });
  }

  // Check if we're currently rate limited
  isCurrentlyRateLimited(): boolean {
    return this.isRateLimited && Date.now() < this.rateLimitResetTime;
  }

  // Get queue status
  getQueueStatus(): { queueLength: number; isProcessing: boolean; isRateLimited: boolean } {
    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      isRateLimited: this.isCurrentlyRateLimited()
    };
  }

  // Clear the queue (use carefully)
  clearQueue(): void {
    this.requestQueue = [];
  }
}

// Export singleton instance
export const coinGeckoLimiter = new CoinGeckoRateLimiter();

// Utility function for components to use
export const makeCoinGeckoRequest = async (url: string, component: string): Promise<any> => {
  try {
    return await coinGeckoLimiter.makeRequest(url, component);
  } catch (error) {
    console.error(`❌ [${component}] Request failed:`, error);
    throw error;
  }
};

export default coinGeckoLimiter;