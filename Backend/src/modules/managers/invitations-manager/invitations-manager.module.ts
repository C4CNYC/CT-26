import { Module } from '@nestjs/common'

import { InvitationModule } from '../../core/invitation/invitation.module'
import { InvitationsManagerService } from './invitations-manager.service'

@Module({
  imports: [InvitationModule],
  providers: [InvitationsManagerService],
  exports: [InvitationsManagerService],
})
export class InvitationsMangerModule {}
