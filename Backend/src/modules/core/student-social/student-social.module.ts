import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentSocial } from './student-social.entity'
import { StudentSocialService } from './student-social.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentSocial])],
  providers: [StudentSocialService],
  exports: [StudentSocialService],
})
export class StudentSocialModule {}
