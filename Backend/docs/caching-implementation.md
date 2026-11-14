---
title: Caching for the Tenant API
description: The in-memory cache for the tenant info endpoint (getTenantInfo), with its keys, invalidation and statistics, and how to add caching to other endpoints.
---

# Caching Implementation for Tenant API

## Overview

This document describes the in-memory caching implementation for the `getTenantInfo` endpoint to improve performance for frequently accessed tenant data.

## Architecture

### Components

1. **InMemoryCacheService** (`src/utils/cache/in-memory-cache.service.ts`)
   - In-memory Map-based cache with TTL support
   - 1-hour default TTL (3600 seconds)
   - Automatic cleanup of expired entries
   - Cache statistics and monitoring

2. **CacheInterceptor** (`src/utils/cache/cache.interceptor.ts`)
   - Intercepts `GET /tenant/:domain` requests
   - Checks cache before database queries
   - Stores successful responses in cache
   - Handles cache misses gracefully

3. **CacheModule** (`src/utils/cache/cache.module.ts`)
   - Organizes cache-related services and interceptors
   - Provides dependency injection for cache services

### Cache Keys

Cache keys follow the pattern: `tenant:domain:{domain}`
- Example: `tenant:domain:example.codetribe.com`

## Implementation Details

### Cached Endpoint

- **Endpoint**: `GET /tenant/:domain`
- **Service**: `organizationMangerService.getBySlug(domain)`
- **Cache TTL**: 1 hour (configurable)

### Cache Invalidation

Cache is automatically invalidated when:
- Organization is updated via `updateOrganization`
- Organization is updated via `updateOrganizationByOwner` 
- Organization is deleted via `deleteOrganization`

### Cache Statistics

The cache service provides statistics:
- Current cache size
- List of cached keys
- Cleanup of expired entries

## Usage

### Adding Cache to New Endpoints

1. Import `CacheModule` in your module
2. Add `@UseInterceptors(CacheInterceptor)` decorator to the endpoint
3. Ensure proper cache key generation for your data

### Manual Cache Operations

```typescript
// Inject the cache service
constructor(private cacheService: InMemoryCacheService) {}

// Get from cache
const cachedData = this.cacheService.get('your-key');

// Set in cache
this.cacheService.set('your-key', data, ttl);

// Delete from cache
this.cacheService.delete('your-key');

// Clear all cache
this.cacheService.clear();

// Get cache statistics
const stats = this.cacheService.getStats();
```

## Performance Benefits

- **Reduced Database Load**: Cached responses avoid database queries
- **Faster Response Times**: In-memory cache provides sub-millisecond access
- **Scalability**: Handles high-traffic scenarios efficiently

## Monitoring

### Cache Hit Rate

Monitor cache effectiveness by checking:
- Cache hits vs misses
- Cache size and memory usage
- TTL effectiveness

### Logging

The cache service logs:
- Cache hits and misses
- Cache sets and deletes
- Cleanup operations

## Configuration

### TTL Configuration

Default TTL is 1 hour. To change:
```typescript
// In cache service
private readonly defaultTTL = 3600; // seconds

// When setting specific TTL
this.cacheService.set(key, value, customTTL);
```

## Limitations

- **Memory Usage**: In-memory cache grows with usage
- **Single Instance**: Cache is not shared across multiple server instances
- **Data Consistency**: Cache may serve stale data until TTL expires or invalidation occurs

## Future Enhancements

1. **Redis Integration**: For distributed caching across multiple instances
2. **Cache Warming**: Pre-populate cache for frequently accessed domains
3. **Metrics Integration**: Export cache metrics to monitoring systems
4. **Cache Compression**: Reduce memory usage for large objects