import { Module } from '@nestjs/common'

import { GoogleClassesModule } from '../../../providers/google-classes/google-classes.module'
import { ClassStudentPendingModule } from '../../core/class-student-pending/class-student-pending.module'
import { ClassModule } from '../../core/class/class.module'
import { StudentModule } from '../../core/student/student.module'
import { SchoolStudentsManagerModule } from '../school-students-manager/school-students-manager.module'
import { SchoolClassStudentsManagerService } from './school-class-students-manager.service'

@Module({
  imports: [
    ClassModule,
    SchoolStudentsManagerModule,
    GoogleClassesModule,
    StudentModule,
    ClassStudentPendingModule,
  ],
  providers: [SchoolClassStudentsManagerService],
  exports: [SchoolClassStudentsManagerService],
})
export class SchoolClassStudentsManagerModule {}
