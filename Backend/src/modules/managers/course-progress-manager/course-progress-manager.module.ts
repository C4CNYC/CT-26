import { Module } from '@nestjs/common'

import { LessonModule } from '@/modules/core/lesson/lesson.module'

import { CourseProgressModule } from '../../core/course-progress/course-progress.module'
import { CourseManagerModule } from '../course-manager/course-manager.module'
import { StudentManagerModule } from '../student-manager/student-manager.module'
import { CourseProgressManagerService } from './course-progress-manager.service'

@Module({
  imports: [
    LessonModule,
    CourseManagerModule,
    CourseProgressModule,
    StudentManagerModule,
  ],
  providers: [CourseProgressManagerService],
  exports: [CourseProgressManagerService],
})
export class CourseProgressManagerModule {}
