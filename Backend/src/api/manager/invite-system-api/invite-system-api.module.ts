import { Module } from '@nestjs/common'

import { InviteSystemManagerModule } from '../../../modules/managers/inviite-system-manager/inviite-system-manager.module'
import { InviteSystemApiController } from './invite-system-api.controller'
import { InviteSystemApiService } from './invite-system-api.service'

@Module({
  imports: [InviteSystemManagerModule],
  providers: [InviteSystemApiService],
  controllers: [InviteSystemApiController],
})
export class InviteSystemApiModule {}
