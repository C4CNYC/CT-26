import { StripePayment } from '@/modules/core/webhooks/stripe.entity'

export type StripeActionTypes =
  | 'checkout.session.completed'
  | 'customer.subscription.updated'

export class StripeResponseDto extends StripePayment {
  actionType: StripeActionTypes
}
