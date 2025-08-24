// Prevent this module from being imported in browser/client contexts
if (typeof window !== 'undefined') {
  throw new Error('Do not import src/lib/stripe from client code — server-side only')
}

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe price IDs for different subscription tiers
export const STRIPE_PRICE_IDS = {
  // These will need to be updated with actual price IDs from your Stripe dashboard
  STARTER: process.env.STRIPE_PRICE_ID_STARTER || 'price_starter',
  PROFESSIONAL: process.env.STRIPE_PRICE_ID_PROFESSIONAL || 'price_professional',
  ENTERPRISE: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise',
} as const

// Stripe subscription statuses
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  PAST_DUE: 'past_due',
  TRIALING: 'trialing',
  UNPAID: 'unpaid',
} as const

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS]