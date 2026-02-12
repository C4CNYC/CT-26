import { Module } from '@nestjs/common'
import { InMemoryCacheService } from './in-memory-cache.service'
import { CacheInterceptor } from './cache.interceptor'
import { CacheMonitorController } from './cache-monitor.controller'

@Module({
  controllers: [CacheMonitorController],
  providers: [InMemoryCacheService, CacheInterceptor],
  exports: [InMemoryCacheService, CacheInterceptor],
})
export class CacheModule {}