import { Module } from '@nestjs/common'

import { AuthModule } from '@/old-auth/auth.module'

import { GoogleAuthModule } from '../../../providers/google-auth/google-auth.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { StudentModule } from '../../core/student/student.module'
import { UserModule } from '../../core/user/user.module'
import { AuthGoogleManagerService } from './auth-google-manager.service'
import { LogActivityManagerModule } from '@/api/manager/logactivity-manager/logactivity.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
    S3Module,
    GoogleAuthModule,
    StudentModule,
    LogActivityManagerModule],
  providers: [AuthGoogleManagerService],
  exports: [AuthGoogleManagerService],
})
export class AuthGoogleManagerModule { }
