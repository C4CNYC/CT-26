import { Module } from '@nestjs/common'

import { IntegrationModule } from '../../core/integration/integration.module'
import { IntegrationManagerService } from './content-integration-manager.service'

@Module({
  imports: [IntegrationModule],
  providers: [IntegrationManagerService],
  exports: [IntegrationManagerService],
})
export class IntegrationManagerModule {}
