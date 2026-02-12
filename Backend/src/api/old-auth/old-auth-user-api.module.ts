import { Module } from '@nestjs/common'

import { AuthModule } from '@/old-auth/auth.module'

import { AuthGoogleManagerModule } from '../../modules/managers/auth-google-manager/auth-google-manager.module'
import { AuthManagerModule } from '../../modules/managers/auth-manager/auth-manager.module'
import { StudentAuthManagerModule } from '../../modules/managers/student-auth-manager/student-auth-manager.module'
import { OldAuthUserApiController } from './old-auth-user-api.controller'

@Module({
  imports: [
    AuthModule,
    AuthManagerModule,
    StudentAuthManagerModule,
    AuthGoogleManagerModule,
  ],
  controllers: [OldAuthUserApiController],
})
export class OldAuthUserApiModule {}
