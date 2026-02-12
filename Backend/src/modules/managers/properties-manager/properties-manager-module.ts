import { Module } from '@nestjs/common'

import { PropertiesModule } from '@/modules/core/properties/properties.module'

import { PropertiesManagerService } from './properties-manager-service'

@Module({
  imports: [PropertiesModule],
  providers: [PropertiesManagerService],
  exports: [PropertiesManagerService],
})
export class PropertiesManagerModule {}
