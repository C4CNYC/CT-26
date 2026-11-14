import { Module } from '@nestjs/common'

import { LogActivityManagerModule } from '@/api/manager/logactivity-manager/logactivity.module'
import { OrganizationModule } from '@/modules/core/organization/organization.module'
import { AuthModule } from '@/old-auth/auth.module'

import { S3Module } from '../../../providers/s3/s3.module'
import { UserModule } from '../../core/user/user.module'
import { SchoolMangerModule } from '../school-manager/school-manager.module'
import { UserResetPasswordManagerModule } from '../user-reset-password-manager/user-reset-password-manager.module'
import { UsersManagerModule } from '../users-manager/users-manager.module'
import { AuthManagerService } from './auth-manager.service'

@Module({
  imports: [
    UserModule,
    AuthModule,
    OrganizationModule,
    UsersManagerModule,
    S3Module,
    SchoolMangerModule,
    UserResetPasswordManagerModule,
    LogActivityManagerModule,
  ],
  providers: [AuthManagerService],
  exports: [AuthManagerService],
})
export class AuthManagerModule {}
