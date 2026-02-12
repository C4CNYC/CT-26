import { Module } from '@nestjs/common'

import { IntegrationManagerModule } from '../../../modules/managers/content-integration-manager/content-integration-manager.module'
import { IntegrationManagerApiController } from './integration-manager-api.controller'
import { IntegrationManagerApiService } from './integration-manager-api.service'

@Module({
  imports: [IntegrationManagerModule],
  providers: [IntegrationManagerApiService],
  controllers: [IntegrationManagerApiController],
})
export class IntegrationManagerApiModule {}
