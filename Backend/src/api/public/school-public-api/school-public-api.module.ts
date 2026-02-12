import { Module } from '@nestjs/common'

import { SchoolMangerModule } from '../../../modules/managers/school-manager/school-manager.module'
import { SchoolPublicApiController } from './school-public-api.controller'

@Module({
  imports: [SchoolMangerModule],
  controllers: [SchoolPublicApiController],
})
export class SchoolPublicApiModule {}
