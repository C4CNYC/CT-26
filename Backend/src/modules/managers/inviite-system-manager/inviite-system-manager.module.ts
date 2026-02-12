import { Module } from '@nestjs/common'

import { InviteSystemModule } from '../../core/invite-system/invite-system.module'
import { SchoolMangerModule } from '../school-manager/school-manager.module'
import { InviteSystemManagerService } from './inviite-system-manager.service'

@Module({
  imports: [InviteSystemModule, SchoolMangerModule],
  exports: [InviteSystemManagerService],
  providers: [InviteSystemManagerService],
})
export class InviteSystemManagerModule {}
