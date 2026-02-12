import { Module } from '@nestjs/common'

import { CourseUnitAuthorManagerModule } from '../../../modules/managers/course-unit-author-manager/course-unit-author-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { CourseUnitAuthorManagerApiController } from './course-unit-author-manager-api.controller'
import { CourseUnitAuthorManagerApiService } from './course-unit-author-manager-api.service'

@Module({
  imports: [CourseUnitAuthorManagerModule, S3Module],
  providers: [CourseUnitAuthorManagerApiService],
  controllers: [CourseUnitAuthorManagerApiController],
})
export class CourseUnitAuthorManagerApiModule {}
