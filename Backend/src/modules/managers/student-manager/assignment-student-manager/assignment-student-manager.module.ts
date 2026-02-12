import { Module } from '@nestjs/common'

import { AssigmentModule } from '../../../core/assigment/assigment.module'
import { StudentModule } from '../../../core/student/student.module'
import { UserModule } from '../../../core/user/user.module'
import { StudentProgressManagerModule } from '../../student-progress-manager/student-progress-manager.module'
import { StudentClassesManagerModule } from '../classes-student-manager/classes-student-manager.module'
import { StudentAssignmentManagerService } from './assignment-student-manager.service'

@Module({
  imports: [
    UserModule,
    AssigmentModule,
    StudentModule,
    StudentClassesManagerModule,
    StudentModule,
    StudentProgressManagerModule,
  ],
  providers: [StudentAssignmentManagerService],
  exports: [StudentAssignmentManagerService],
})
export class StudentAssignmentsManagerModule {}
