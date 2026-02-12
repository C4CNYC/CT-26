import { Module } from '@nestjs/common'

import { AuthManagerModule } from '@/modules/managers/auth-manager/auth-manager.module'
import { OrganizationManagerModule } from '@/modules/managers/organization-manger/organization-manger.module'
import { SchoolMangerModule } from '@/modules/managers/school-manager/school-manager.module'
import { UsersManagerModule } from '@/modules/managers/users-manager/users-manager.module'
import { S3Module } from '@/providers/s3/s3.module'
import { CacheModule } from '@/utils/cache/cache.module'

import { TenantPublicApiController } from './tenant-public-api.controller'
import { TenantPublicApiService } from './tenant-public-api.service'

@Module({
  imports: [
    OrganizationManagerModule,
    AuthManagerModule,
    UsersManagerModule,
    SchoolMangerModule,
    S3Module,
    CacheModule,
  ],
  controllers: [TenantPublicApiController],
  providers: [TenantPublicApiService],
})
export class TenantPublicApiModule {}
