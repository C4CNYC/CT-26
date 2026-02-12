import { Injectable, Logger } from '@nestjs/common'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

@Injectable()
export class InMemoryCacheService {
  private readonly logger = new Logger(InMemoryCacheService.name)
  private readonly cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 3600 

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.logger.debug(`Cache entry expired for key: ${key}`)
      return null
    }

    this.logger.debug(`Cache hit for key: ${key}`)
    return entry.value
  }

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expiresAt = Date.now() + ttl * 1000
    this.cache.set(key, { value, expiresAt })
    this.logger.debug(`Cache set for key: ${key} with TTL: ${ttl}s`)
  }

  /**
   * Delete a value from cache by key
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.logger.debug(`Cache deleted for key: ${key}`)
    }
    return deleted
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    this.logger.debug(`Cache cleared, removed ${size} entries`)
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now()
    let cleanedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired cache entries`)
    }

    return cleanedCount
  }

  /**
   * Generate cache key for tenant domain
   */
  generateTenantKey(domain: string): string {
    return `tenant:domain:${domain}`
  }
}