import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Invitation } from './invitation.entity'
import { InvitationService } from './invitations.service'

@Module({
  imports: [TypeOrmModule.forFeature([Invitation])],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
