import { Module } from '@nestjs/common'

import { CourseUnitModule } from '../../core/course-unit/course-unit.module'
import { LessonModule } from '../../core/lesson/lesson.module'
import { CourseUnitLessonsManagerService } from './course-unit-lessons-manager.service'

@Module({
  imports: [CourseUnitModule, LessonModule],
  exports: [CourseUnitLessonsManagerService],
  providers: [CourseUnitLessonsManagerService],
})
export class CourseUnitLessonsManagerModule {}
