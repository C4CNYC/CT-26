import { Column, Entity } from 'typeorm'

import { BaseEntity } from '@/utils/base/base.entity'

@Entity('webhooks_stripe_payments')
export class StripePayment extends BaseEntity {
  @Column()
  type: string

  @Column('int')
  amount: number

  @Column('text')
  product: string

  @Column('int')
  current_period_start: number

  @Column('int')
  current_period_end: number

  @Column('text')
  dump: string

  @Column('text')
  stripeUser: string

  @Column('text')
  user: string
}
