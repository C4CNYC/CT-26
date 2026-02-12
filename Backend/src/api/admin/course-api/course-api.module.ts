import { Module } from '@nestjs/common'

import { CatalogCourseModule } from '../../../modules/core/catalog-course/catalog-course.module'
import { CourseModule } from '../../../modules/core/course/course.module'
import { CourseApiController } from './course-api.controller'
import { CourseApiService } from './course-api.service'

@Module({
  imports: [CourseModule, CatalogCourseModule],
  providers: [CourseApiService],
  controllers: [CourseApiController],
})
export class CourseApiModule {}
