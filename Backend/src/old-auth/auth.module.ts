import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { StudentInvitationModule } from '../modules/core/student-invitation/student-invitation.module'
import { StudentModule } from '../modules/core/student/student.module'
import { UserModule } from '../modules/core/user/user.module'
import { AuthPasswordsService } from './auth-password.service'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LogActivityManagerModule } from '@/api/manager/logactivity-manager/logactivity.module'

@Module({
  imports: [
    UserModule,
    StudentModule,
    StudentInvitationModule,
    JwtModule.register({
      secret: 'some_secret',
      signOptions: {
        expiresIn: '12d',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LogActivityManagerModule
  ],
  providers: [AuthService, JwtStrategy, AuthPasswordsService],
  exports: [AuthService, AuthPasswordsService],
})
export class AuthModule {}
