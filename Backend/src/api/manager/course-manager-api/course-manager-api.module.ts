import { Module } from '@nestjs/common'

import { CourseCourseUnitManagerModule } from '../../../modules/managers/course-course-unit-manager/course-course-unit-manager.module'
import { CourseManagerModule } from '../../../modules/managers/course-manager/course-manager.module'
import { UsersManagerModule } from '../../../modules/managers/users-manager/users-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { CourseManagerApiController } from './course-manager-api.controller'
import { CourseManagerApiService } from './course-manager-api.service'

@Module({
  imports: [
    CourseManagerModule,
    CourseCourseUnitManagerModule,
    S3Module,
    UsersManagerModule,
  ],
  providers: [CourseManagerApiService],
  controllers: [CourseManagerApiController],
})
export class CourseManagerApiModule {}
