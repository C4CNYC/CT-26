import { Module } from '@nestjs/common'

import { UserModule } from '@/modules/core/user/user.module'
import { StripeModule } from '@/modules/core/webhooks/stripe.module'

import { AccessControlManagerModule } from '../access-control-manager/access-control-manager.module'
import { PaymentManagerService } from './payment-manager.service'

@Module({
  imports: [StripeModule, AccessControlManagerModule, UserModule],
  providers: [PaymentManagerService],
  exports: [PaymentManagerService],
})
export class PaymentManagerModule {}
