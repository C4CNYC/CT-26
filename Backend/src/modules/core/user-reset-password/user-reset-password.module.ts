import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserResetPassword } from './user-reset-password.entity'
import { UserResetPasswordService } from './user-reset-password.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserResetPassword])],
  providers: [UserResetPasswordService],
  exports: [UserResetPasswordService],
})
export class UserResetPassworModule {}
