import { Module } from '@nestjs/common'

import { CourseAuthorManagerModule } from '../../../modules/managers/course-author-manager/course-author-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { CourseAuthorManagerApiController } from './course-author-manager-api.controller'
import { CourseAuthorManagerApiService } from './course-author-manager-api.service'

@Module({
  imports: [CourseAuthorManagerModule, S3Module],
  providers: [CourseAuthorManagerApiService],
  controllers: [CourseAuthorManagerApiController],
})
export class CourseAuthorManagerApiModule {}
