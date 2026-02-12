import { Module } from '@nestjs/common'

import { AuthModule } from '@/old-auth/auth.module'

import { ClassModule } from '../../core/class/class.module'
import { SchoolModule } from '../../core/school/school.module'
import { StudentInvitationModule } from '../../core/student-invitation/student-invitation.module'
import { StudentModule } from '../../core/student/student.module'
import { UserModule } from '../../core/user/user.module'
import { InvitationsMangerModule } from '../invitations-manager/invitations-manager.module'
import { StudentManagerModule } from '../student-manager/student-manager.module'
import { UsersManagerModule } from '../users-manager/users-manager.module'
import { SchoolStudentsManagerService } from './school-students-manager.service'

@Module({
  imports: [
    UserModule,
    AuthModule,
    ClassModule,
    SchoolModule,
    StudentModule,
    UsersManagerModule,
    StudentManagerModule,
    InvitationsMangerModule,
    StudentInvitationModule,
  ],
  providers: [SchoolStudentsManagerService],
  exports: [SchoolStudentsManagerService],
})
export class SchoolStudentsManagerModule {}
