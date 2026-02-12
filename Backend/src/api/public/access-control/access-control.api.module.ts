import { Module } from '@nestjs/common'

import { AccessControlManagerModule } from '@/modules/managers/access-control-manager/access-control-manager.module'

import { AccessControlAPIController } from './access-control.api.controller'

@Module({
  imports: [AccessControlManagerModule],
  controllers: [AccessControlAPIController],
})
export class AccessControlAPIControllerModule {}
