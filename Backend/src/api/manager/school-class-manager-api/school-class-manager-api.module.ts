import { Module } from '@nestjs/common'

import { ClassMentorManagerModule } from '../../../modules/managers/class-mentor-manager/class-mentor-manager.module'
import { SchoolClassManagerModule } from '../../../modules/managers/school-class-manager/school-class-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { SchoolClassManagerApiController } from './school-class-manager-api.controller'
import { SchoolClassManagerApiService } from './school-class-manager-api.service'

@Module({
  imports: [SchoolClassManagerModule, ClassMentorManagerModule, S3Module],
  providers: [SchoolClassManagerApiService],
  controllers: [SchoolClassManagerApiController],
})
export class SchoolClassManagerApiModule {}
