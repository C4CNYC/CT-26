import { Module } from '@nestjs/common'

import { AccessControlEntityModule } from '@/modules/core/access-control/access-control.module'

import { AccessControlManagerService } from './access-control-manager-service'

@Module({
  imports: [AccessControlEntityModule],
  providers: [AccessControlManagerService],
  exports: [AccessControlManagerService],
})
export class AccessControlManagerModule {}
