import { Module } from '@nestjs/common'

import { AuthModule } from '@/old-auth/auth.module'
import { LogActivityManagerModule } from '@/api/manager/logactivity-manager/logactivity.module'

import { GoogleAuthModule } from '../../../providers/google-auth/google-auth.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { OrganizationModule } from '../../core/organization/organization.module'
import { StudentModule } from '../../core/student/student.module'
import { UserModule } from '../../core/user/user.module'
import { SchoolClassStudentsManagerModule } from '../school-class-students-manager/school-class-students-manager.module'
import { SchoolClassManagerModule } from '../school-class-manager/school-class-manager.module'
import { SchoolMangerModule } from '../school-manager/school-manager.module'
import { LessonDeepAssignModule } from '../lesson-deep-assign/lesson-deep-assign.module'
import { AuthGoogleManagerService } from './auth-google-manager.service'

@Module({
  imports: [
    UserModule,
    AuthModule,
    S3Module,
    GoogleAuthModule,
    OrganizationModule,
    StudentModule,
    LogActivityManagerModule,
    SchoolMangerModule,
    SchoolClassManagerModule,
    SchoolClassStudentsManagerModule,
    LessonDeepAssignModule,
  ],
  providers: [AuthGoogleManagerService],
  exports: [AuthGoogleManagerService],
})
export class AuthGoogleManagerModule { }
