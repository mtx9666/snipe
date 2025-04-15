export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private readonly minInterval: number;

  constructor(requestsPerSecond: number) {
    this.minInterval = 1000 / requestsPerSecond; // Convert RPS to milliseconds between requests
  }

  async schedule<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;

    const now = Date.now();
    const timeToWait = Math.max(0, this.lastRequestTime + this.minInterval - now);
    
    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }

    const task = this.queue.shift();
    if (task) {
      this.lastRequestTime = Date.now();
      await task();
    }

    // Process next item in queue
    this.processQueue();
  }
} 