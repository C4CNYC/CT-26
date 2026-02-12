import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentResetPassword } from './student-reset-password.entity'
import { StudentResetPasswordService } from './student-reset-password.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentResetPassword])],
  providers: [StudentResetPasswordService],
  exports: [StudentResetPasswordService],
})
export class StudentResetPassworModule {}
