import { Module } from '@nestjs/common'

import { UserResetPassworModule } from '../../core/user-reset-password/user-reset-password.module'
import { UserResetPasswordManagerService } from './user-reset-password-manager.service'

@Module({
  imports: [UserResetPassworModule],
  providers: [UserResetPasswordManagerService],
  exports: [UserResetPasswordManagerService],
})
export class UserResetPasswordManagerModule {}
