import { Module } from '@nestjs/common'

import { WorkspacePublicApiModule } from '../old-public/workspace-public-api/workspace-public-api.module'
import { AccessControlAPIControllerModule } from './access-control/access-control.api.module'
import { ClassPublicApiModule } from './class-public-api/class-public-api.module'
import { JokesPublicApiModule } from './jokes-public-api/jokes-public-api.module'
import { SchoolPublicApiModule } from './school-public-api/school-public-api.module'
import { TenantPublicApiModule } from './tenant-public-api/tenant-public-api.module'
import { WebhooksAPIModule } from './webhooks/payment.api.module'

@Module({
  imports: [
    AccessControlAPIControllerModule,
    SchoolPublicApiModule,
    ClassPublicApiModule,
    WorkspacePublicApiModule,
    TenantPublicApiModule,
    WebhooksAPIModule,
    JokesPublicApiModule,
  ],
  controllers: [],
})
export class PublicApiModule {}
