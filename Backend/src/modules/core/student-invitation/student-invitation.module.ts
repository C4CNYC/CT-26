import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StudentInvitation } from './student-invitation.entity'
import { StudentInvitationService } from './student-invitation.service'

@Module({
  imports: [TypeOrmModule.forFeature([StudentInvitation])],
  providers: [StudentInvitationService],
  exports: [StudentInvitationService],
})
export class StudentInvitationModule {}
