import { Module } from '@nestjs/common'

import { LogActivityManagerModule } from '@/api/manager/logactivity-manager/logactivity.module'
import { OrganizationModule } from '@/modules/core/organization/organization.module'
import { AuthModule } from '@/old-auth/auth.module'

import { S3Module } from '../../../providers/s3/s3.module'
import { UserModule } from '../../core/user/user.module'
import { AuthGoogleManagerModule } from '../auth-google-manager/auth-google-manager.module'
import { LessonDeepAssignModule } from '../lesson-deep-assign/lesson-deep-assign.module'
import { SchoolClassStudentsManagerModule } from '../school-class-students-manager/school-class-students-manager.module'
import { SchoolMangerModule } from '../school-manager/school-manager.module'
import { InviteSystemModule } from '../../core/invite-system/invite-system.module'
import { UserResetPasswordManagerModule } from '../user-reset-password-manager/user-reset-password-manager.module'
import { UsersManagerModule } from '../users-manager/users-manager.module'
import { AuthManagerService } from './auth-manager.service'
import { SchoolClassManagerModule } from '../school-class-manager/school-class-manager.module'
import { StudentModule } from '@/modules/core/student/student.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
    OrganizationModule,
    AuthGoogleManagerModule,
    UsersManagerModule,
    S3Module,
    SchoolMangerModule,
    StudentModule,
    SchoolClassStudentsManagerModule,
    UserResetPasswordManagerModule,
    SchoolClassManagerModule,
    LessonDeepAssignModule,
    LogActivityManagerModule,
    InviteSystemModule,
  ],
  providers: [AuthManagerService],
  exports: [AuthManagerService],
})
export class AuthManagerModule {}
