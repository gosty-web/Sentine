export class RetryHandler {
  private maxRetries: number;
  private retryCount: Map<string, number> = new Map();

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
  }

  public shouldRetry(taskId: string): boolean {
    const count = this.retryCount.get(taskId) || 0;
    return count < this.maxRetries;
  }

  public incrementRetry(taskId: string) {
    const count = this.retryCount.get(taskId) || 0;
    this.retryCount.set(taskId, count + 1);
  }

  public getRetryCount(taskId: string): number {
    return this.retryCount.get(taskId) || 0;
  }
}
