import { Heading, Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { Button } from '@/components/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - RinkFlow',
  description: 'Learn about RinkFlow and our mission to simplify hockey organization management.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <section className="py-16 lg:py-24">
        <Heading className="text-4xl lg:text-5xl mb-8 text-center">
          About RinkFlow
        </Heading>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
          <Text className="text-lg leading-relaxed">
            RinkFlow was founded by hockey enthusiasts who experienced firsthand the challenges 
            of managing youth hockey organizations. We saw the need for a comprehensive, 
            user-friendly platform that could handle everything from team rosters to tournament 
            management.
          </Text>

          <Text className="leading-relaxed">
            Our mission is to simplify hockey organization management so coaches and administrators 
            can focus on what matters most: developing players and growing the sport we love.
          </Text>

          <Subheading className="text-2xl mt-12 mb-4">Our Values</Subheading>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Subheading className="text-lg mb-2">Simplicity</Subheading>
              <Text className="text-zinc-600 dark:text-zinc-400">
                We believe software should be intuitive and easy to use, not complicated.
              </Text>
            </div>
            <div>
              <Subheading className="text-lg mb-2">Reliability</Subheading>
              <Text className="text-zinc-600 dark:text-zinc-400">
                Organizations depend on us, so we ensure our platform is always available.
              </Text>
            </div>
            <div>
              <Subheading className="text-lg mb-2">Community</Subheading>
              <Text className="text-zinc-600 dark:text-zinc-400">
                We're part of the hockey community and actively listen to user feedback.
              </Text>
            </div>
            <div>
              <Subheading className="text-lg mb-2">Innovation</Subheading>
              <Text className="text-zinc-600 dark:text-zinc-400">
                We continuously improve our platform with new features and capabilities.
              </Text>
            </div>
          </div>

          <div className="text-center mt-16">
            <Subheading className="text-2xl mb-4">
              Ready to streamline your organization?
            </Subheading>
            <Button href="/organizations/new" className="px-8 py-3">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}