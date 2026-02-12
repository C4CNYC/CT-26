import { Module } from '@nestjs/common'

import { StudentLessonProgressModule } from '@/modules/core/student-lesson-progress/student-lesson-progress.module'

import { CourseProgressModule } from '../../core/course-progress/course-progress.module'
import { LessonContentManagerModule } from '../lesson-content-manager/lesson-content-manager.module'
import { StudentManagerModule } from '../student-manager/student-manager.module'
import { StudentProgressManagerService } from './student-progress-manager.service'

@Module({
  imports: [
    CourseProgressModule,
    StudentManagerModule,
    LessonContentManagerModule,
    StudentLessonProgressModule,
  ],
  providers: [StudentProgressManagerService],
  exports: [StudentProgressManagerService],
})
export class StudentProgressManagerModule {}
