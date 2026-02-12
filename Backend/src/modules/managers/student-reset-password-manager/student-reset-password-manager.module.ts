import { Module } from '@nestjs/common'

import { StudentResetPassworModule } from '../../core/student-reset-password/student-reset-password.module'
import { StudentResetPasswordManagerService } from './student-reset-password-manager.service'

@Module({
  imports: [StudentResetPassworModule],
  providers: [StudentResetPasswordManagerService],
  exports: [StudentResetPasswordManagerService],
})
export class StudentResetPasswordManagerModule {}
