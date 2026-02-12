import { Module } from '@nestjs/common'

import { ClassStudentPendingModule } from '../../../core/class-student-pending/class-student-pending.module'
import { ClassModule } from '../../../core/class/class.module'
import { CourseModule } from '../../../core/course/course.module'
import { StudentModule } from '../../../core/student/student.module'
import { StudentClassesManagerService } from './classes-student-manager.service'

@Module({
  imports: [
    ClassModule,
    StudentModule,
    CourseModule,
    ClassStudentPendingModule,
  ],
  providers: [StudentClassesManagerService],
  exports: [StudentClassesManagerService],
})
export class StudentClassesManagerModule {}
