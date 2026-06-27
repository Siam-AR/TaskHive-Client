import 'server-only'

import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export function getStripe() {
  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }
  return new Stripe(stripeSecretKey)
}
