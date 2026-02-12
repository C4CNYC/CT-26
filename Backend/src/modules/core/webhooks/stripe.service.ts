import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '@/utils/base/base.service'

import { StripePayment } from './stripe.entity'

@Injectable()
export class StripeService extends BaseService<StripePayment> {
  constructor(
    @InjectRepository(StripePayment)
    public repository: Repository<StripePayment>,
  ) {
    super(StripePayment, repository)
  }
  async StripeUserToUser(userId: string): Promise<string | null> {
    const previousPayment = await this.repository.findOne({
      where: { stripeUser: userId },
    })
    if (previousPayment) {
      return previousPayment.user
    }
    return null
  }
}
