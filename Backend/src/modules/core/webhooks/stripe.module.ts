import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StripePayment } from './stripe.entity'
import { StripeService } from './stripe.service'

@Module({
  imports: [TypeOrmModule.forFeature([StripePayment])],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
