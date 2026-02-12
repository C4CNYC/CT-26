import { Module } from '@nestjs/common'

import { PaymentManagerModule } from '@/modules/managers/webhooks-manager/payment-manager.module'

import { PaymentWebhooks } from './payment.api.controller'

@Module({
  imports: [PaymentManagerModule],
  controllers: [PaymentWebhooks],
})
export class WebhooksAPIModule {}
