import { Module } from '@nestjs/common'

import { SchoolModule } from '../../../modules/core/school/school.module'
import { SchoolMangerModule } from '../../../modules/managers/school-manager/school-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { SchoolManagerApiController } from './school-manager-api.controller'
import { SchoolManagerApiService } from './school-manager-api.service'

@Module({
  imports: [SchoolMangerModule, SchoolModule, S3Module],
  controllers: [SchoolManagerApiController],
  providers: [SchoolManagerApiService],
})
export class SchoolManagerApiModule {}
