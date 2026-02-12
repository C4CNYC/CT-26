import { Module } from '@nestjs/common'

import { CourseProgressManagerModule } from '../../../modules/managers/course-progress-manager/course-progress-manager.module'
import { CourseProgressManagerApiController } from './course-progress-manager-api.controller'
import { CourseProgressManagerApiService } from './course-progress-manager-api.service'

@Module({
  imports: [CourseProgressManagerModule],
  providers: [CourseProgressManagerApiService],
  controllers: [CourseProgressManagerApiController],
})
export class CourseProgressManagerApiModule {}
