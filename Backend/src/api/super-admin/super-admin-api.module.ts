import { Module } from '@nestjs/common'

import { OrganizationApiModule } from './organization-api/organization-api.module'

@Module({
  imports: [OrganizationApiModule],
})
export class SuperAdminApiModule {}
