import { Module } from '@nestjs/common'

import { OrganizationModule } from '@/modules/core/organization/organization.module'
import { UserModule } from '@/modules/core/user/user.module'
import { S3Module } from '@/providers/s3/s3.module'
import { CacheModule } from '@/utils/cache/cache.module'

import { OrganizationManagerService } from './organization-manger.service'

@Module({
  imports: [OrganizationModule, S3Module, UserModule, CacheModule],
  providers: [OrganizationManagerService],
  exports: [OrganizationManagerService],
})
export class OrganizationManagerModule {}
