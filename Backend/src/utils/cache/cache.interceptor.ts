import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { InMemoryCacheService } from './in-memory-cache.service'

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: InMemoryCacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const { method, params } = request

    // Only cache GET requests for tenant info
    if (method !== 'GET' || !params?.domain) {
      return next.handle()
    }

    const domain = params.domain
    const cacheKey = this.cacheService.generateTenantKey(domain)

    // cache first
    const cachedData = this.cacheService.get(cacheKey)
    if (cachedData) {
      return of(cachedData)
    }

    // If not in cache, proceed with the request and cache the result
    return next.handle().pipe(
      tap((data) => {
        if (data) {
          this.cacheService.set(cacheKey, data)
        }
      }),
    )
  }
}