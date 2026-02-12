import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { Role } from '@/modules/core/user/enums/role.enum'
import { InMemoryCacheService } from './in-memory-cache.service'

@Controller('cache')
export class CacheMonitorController {
  constructor(private readonly cacheService: InMemoryCacheService) {}

  @Get('stats')
  getStats() {
    return this.cacheService.getStats()
  }

  @Get('cleanup')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  cleanup() {
    const cleanedCount = this.cacheService.cleanup()
    return {
      message: `Cleaned up ${cleanedCount} expired entries`,
      stats: this.cacheService.getStats(),
    }
  }

  @Get('clear')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  clear() {
    this.cacheService.clear()
    return {
      message: 'Cache cleared successfully',
      stats: this.cacheService.getStats(),
    }
  }
}