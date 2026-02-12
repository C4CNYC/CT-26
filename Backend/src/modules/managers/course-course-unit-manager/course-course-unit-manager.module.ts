import { Module } from '@nestjs/common'

import { CourseUnitModule } from '../../core/course-unit/course-unit.module'
import { CourseModule } from '../../core/course/course.module'
import { CourseCourseUnitManagerService } from './course-course-unit-manager.service'

@Module({
  imports: [CourseUnitModule, CourseModule],
  exports: [CourseCourseUnitManagerService],
  providers: [CourseCourseUnitManagerService],
})
export class CourseCourseUnitManagerModule {}
