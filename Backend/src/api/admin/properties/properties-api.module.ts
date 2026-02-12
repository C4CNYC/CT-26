import { Module } from '@nestjs/common'

import { PropertiesManagerModule } from '@/modules/managers/properties-manager/properties-manager-module'

import { PropertiesApiController } from './properties-api.controller'
import { PropertiesApiService } from './properties-api.services'

@Module({
  imports: [PropertiesManagerModule],
  providers: [PropertiesApiService],
  controllers: [PropertiesApiController],
})
export class PropertiesApiModule {}
