import { Module } from '@nestjs/common'

import { AuthModule } from '@/old-auth/auth.module'

import { OrganizationModule } from '../../core/organization/organization.module'
import { StudentModule } from '../../core/student/student.module'
import { UserModule } from '../../core/user/user.module'
import { UsersManagerService } from './users-managers.service'

@Module({
  imports: [UserModule, StudentModule, AuthModule, OrganizationModule],
  providers: [UsersManagerService],
  exports: [UsersManagerService],
})
export class UsersManagerModule {}
