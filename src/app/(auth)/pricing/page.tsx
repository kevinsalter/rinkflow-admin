import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - RinkFlow',
  description: 'Simple, transparent pricing for hockey organizations of all sizes.',
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <section className="text-center py-16 lg:py-24">
        <Heading className="text-4xl lg:text-5xl mb-4">
          Simple, Transparent Pricing
        </Heading>
        <Text className="text-lg lg:text-xl max-w-2xl mx-auto">
          Choose the plan that best fits your organization. All plans include a 30-day free trial.
        </Text>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-16 lg:pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={clsx(
                'rounded-lg border p-8',
                tier.featured
                  ? 'border-zinc-900 dark:border-zinc-100 shadow-xl relative'
                  : 'border-zinc-200 dark:border-zinc-800'
              )}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <Subheading className="text-2xl mb-2">{tier.name}</Subheading>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  {tier.description}
                </Text>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">/{tier.period}</span>
                </div>
                {tier.teamCount && (
                  <Text className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    {tier.teamCount}
                  </Text>
                )}
              </div>

              {tier.featured ? (
                <Button href="/organizations/new" className="w-full mb-6">
                  Start Free Trial
                </Button>
              ) : (
                <Button href="/organizations/new" className="w-full mb-6" outline>
                  Start Free Trial
                </Button>
              )}

              <div className="space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex gap-3">
                    <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <Text className="text-sm">{feature}</Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <Heading className="text-3xl text-center mb-12">
            Frequently Asked Questions
          </Heading>
          
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <Subheading className="text-lg mb-2">{faq.question}</Subheading>
                <Text className="text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const pricingTiers = [
  {
    name: 'Starter',
    description: 'Perfect for small clubs and recreational teams',
    price: 29,
    period: 'month',
    teamCount: 'Up to 3 teams',
    features: [
      'Up to 50 players',
      'Basic scheduling',
      'Team communications',
      'Mobile app access',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    description: 'Ideal for competitive organizations',
    price: 79,
    period: 'month',
    teamCount: 'Up to 10 teams',
    featured: true,
    features: [
      'Up to 200 players',
      'Advanced scheduling',
      'Tournament management',
      'Registration & payments',
      'Custom branding',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large associations and leagues',
    price: 199,
    period: 'month',
    teamCount: 'Unlimited teams',
    features: [
      'Unlimited players',
      'Multi-facility scheduling',
      'League management',
      'Advanced reporting',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
]

const faqs = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All plans include a 30-day free trial. No credit card required to start.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, ACH transfers for annual plans, and can arrange invoicing for enterprise customers.',
  },
  {
    question: 'Is there a discount for annual billing?',
    answer: 'Yes, you can save 20% when you choose annual billing instead of monthly.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.',
  },
]