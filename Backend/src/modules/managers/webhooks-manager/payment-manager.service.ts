import { Inject } from '@nestjs/common'

import { UserService } from '@/modules/core/user/user.service'
import { StripeService } from '@/modules/core/webhooks/stripe.service'

import { AccessControlManagerService } from '../access-control-manager/access-control-manager-service'
import { StripeResponseDto } from './stripe.dto'

export class PaymentManagerService {
  constructor(
    @Inject(StripeService) private stripeService: StripeService,
    private accessControlManager: AccessControlManagerService,
    private userService: UserService,
  ) {}
  async saveNewStripePayment(dto: StripeResponseDto) {
    await this.stripeService.create(dto)
    const user = await this.userService.findOne({ where: { id: dto.user } })
    if (!user) {
      console.log('User not found', dto)
    } else {
      console.log('User granted privialages:', user.email)
      await this.accessControlManager.setToUserId(user.id, {
        feature: 'MumuAICreator',
        maxUsageCount: 10,
      })
    }
  }
}
