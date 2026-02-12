import { Module } from '@nestjs/common'

import { UserModule } from '@/modules/core/user/user.module'

import { CourseUnitLessonsManagerModule } from '../../../modules/managers/course-unit-lessons-manager/course-unit-lessons-manager.module'
import { CourseUnitManagerModule } from '../../../modules/managers/course-unit-manager/course-unit-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { CourseUnitManagerApiController } from './course-unit-manager-api.controller'
import { CourseUnitManagerApiService } from './course-unit-manager-api.service'

@Module({
  imports: [
    CourseUnitManagerModule,
    CourseUnitLessonsManagerModule,
    S3Module,
    UserModule,
  ],
  providers: [CourseUnitManagerApiService],
  controllers: [CourseUnitManagerApiController],
})
export class CourseUnitManagerApiModule {}
