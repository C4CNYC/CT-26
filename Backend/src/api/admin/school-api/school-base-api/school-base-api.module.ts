import { Module } from '@nestjs/common'

import { SchoolMangerModule } from '../../../../modules/managers/school-manager/school-manager.module'
import { SchoolBaseApiController } from './school-base-api.controller'
import { SchoolBaseApiService } from './school-base-api.service'

@Module({
  imports: [SchoolMangerModule],
  providers: [SchoolBaseApiService],
  controllers: [SchoolBaseApiController],
})
export class SchoolBaseApiModule {}
