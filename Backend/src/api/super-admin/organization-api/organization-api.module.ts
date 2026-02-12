import { Module } from '@nestjs/common'

import { OrganizationManagerModule } from '@/modules/managers/organization-manger/organization-manger.module'

import { OrganizationApiController } from './organization-api.controller'

@Module({
  imports: [OrganizationManagerModule],
  controllers: [OrganizationApiController],
})
export class OrganizationApiModule {}
