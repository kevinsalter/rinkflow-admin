import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Rinkflow',
  description: 'Get in touch with our team to discuss your hockey organization needs.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="py-16 lg:py-24">
        <div className="text-center mb-12">
          <Heading className="text-4xl lg:text-5xl mb-4">
            Get in Touch
          </Heading>
          <Text className="text-lg lg:text-xl max-w-2xl mx-auto">
            Ready to transform your hockey organization? Let's discuss how Rinkflow can meet your specific needs.
          </Text>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <Subheading className="text-2xl mb-6">Send us a message</Subheading>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field>
                  <Label>First Name</Label>
                  <Input name="first_name" required />
                </Field>
                <Field>
                  <Label>Last Name</Label>
                  <Input name="last_name" required />
                </Field>
              </div>

              <Field>
                <Label>Email</Label>
                <Input type="email" name="email" required />
              </Field>

              <Field>
                <Label>Phone</Label>
                <Input type="tel" name="phone" />
              </Field>

              <Field>
                <Label>Organization Name</Label>
                <Input name="organization" />
              </Field>

              <Field>
                <Label>Organization Size</Label>
                <Select name="size">
                  <option value="">Please select...</option>
                  <option>1-5 teams</option>
                  <option>6-15 teams</option>
                  <option>16-30 teams</option>
                  <option>30+ teams</option>
                </Select>
              </Field>

              <Field>
                <Label>How can we help?</Label>
                <Textarea name="message" rows={5} required />
              </Field>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="lg:pl-12">
            <Subheading className="text-2xl mb-6">Let's talk</Subheading>
            <Text className="mb-8">
              Our team is here to help you find the perfect solution for your organization. 
              Pricing is customized based on your specific needs and scale.
            </Text>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3">
                  <EnvelopeIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <Text className="font-medium mb-1">Email</Text>
                  <Text className="text-zinc-600 dark:text-zinc-400">
                    sales@rinkflow.com
                  </Text>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3">
                  <PhoneIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <Text className="font-medium mb-1">Phone</Text>
                  <Text className="text-zinc-600 dark:text-zinc-400">
                    1-800-RINKFLOW
                  </Text>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3">
                  <MapPinIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <Text className="font-medium mb-1">Office</Text>
                  <Text className="text-zinc-600 dark:text-zinc-400">
                    Toronto, Canada
                  </Text>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Subheading className="text-lg mb-3">Custom Pricing</Subheading>
              <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                Every hockey organization is unique. We offer flexible pricing tailored to your 
                number of teams, players, and specific feature requirements. Contact us for a 
                personalized quote.
              </Text>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}