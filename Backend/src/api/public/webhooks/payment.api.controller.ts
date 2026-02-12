import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { PaymentManagerService } from '@/modules/managers/webhooks-manager/payment-manager.service'
import { StripeResponseDto } from '@/modules/managers/webhooks-manager/stripe.dto'

@ApiTags('Payment webhooks', 'To control feature access')
@Controller('/payment')
export class PaymentWebhooks {
  constructor(private paymentManagerService: PaymentManagerService) {}

  @Post('/stripe')
  async StripePayment(@Body() dto: any) {
    const stripeDto = new StripeResponseDto()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    stripeDto.actionType = dto.actionType
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    stripeDto.user = dto?.data?.object?.client_reference_id
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    stripeDto.stripeUser = dto?.data?.object?.customer
    stripeDto.dump = JSON.stringify(dto)
    await this.paymentManagerService.saveNewStripePayment(stripeDto)
    return 'something'
  }
}
