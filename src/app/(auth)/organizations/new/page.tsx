import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text, TextLink, Strong } from '@/components/text'
import { Textarea } from '@/components/textarea'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Organization - RinkFlow',
  description: 'Set up your hockey organization on RinkFlow.',
}

export default function OrganizationSignup() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-2xl">
        <form action="" method="POST" className="grid grid-cols-1 gap-8">
          <div className="grid gap-2">
            <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
            <Heading>Create Your Organization</Heading>
            <Text>Start your 30-day free trial. No credit card required.</Text>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <Subheading className="mb-6">Organization Details</Subheading>
            
            <div className="grid gap-6">
              <Field>
                <Label>Organization Name</Label>
                <Input name="org_name" placeholder="e.g., Metro Hockey Club" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field>
                  <Label>Organization Type</Label>
                  <Select name="org_type">
                    <option>Youth Hockey Club</option>
                    <option>Adult League</option>
                    <option>High School</option>
                    <option>College/University</option>
                    <option>Tournament Organizer</option>
                    <option>Other</option>
                  </Select>
                </Field>

                <Field>
                  <Label>Number of Teams</Label>
                  <Select name="team_count">
                    <option>1-3 teams</option>
                    <option>4-10 teams</option>
                    <option>11-20 teams</option>
                    <option>20+ teams</option>
                  </Select>
                </Field>
              </div>

              <Field>
                <Label>Primary Location</Label>
                <Input name="location" placeholder="City, State/Province" />
              </Field>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <Subheading className="mb-6">Administrator Account</Subheading>
            
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field>
                  <Label>First Name</Label>
                  <Input name="first_name" />
                </Field>

                <Field>
                  <Label>Last Name</Label>
                  <Input name="last_name" />
                </Field>
              </div>

              <Field>
                <Label>Email Address</Label>
                <Input type="email" name="email" />
              </Field>

              <Field>
                <Label>Phone Number</Label>
                <Input type="tel" name="phone" placeholder="(555) 123-4567" />
              </Field>

              <Field>
                <Label>Password</Label>
                <Input type="password" name="password" autoComplete="new-password" />
                <Text className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Must be at least 8 characters
                </Text>
              </Field>

              <Field>
                <Label>Confirm Password</Label>
                <Input type="password" name="password_confirmation" autoComplete="new-password" />
              </Field>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <Subheading className="mb-6">Additional Information (Optional)</Subheading>
            
            <div className="grid gap-6">
              <Field>
                <Label>How did you hear about us?</Label>
                <Select name="referral_source">
                  <option value="">Please select...</option>
                  <option>Search engine</option>
                  <option>Social media</option>
                  <option>Word of mouth</option>
                  <option>Hockey conference/event</option>
                  <option>Other</option>
                </Select>
              </Field>

              <Field>
                <Label>Tell us about your organization</Label>
                <Textarea 
                  name="description" 
                  rows={4}
                  placeholder="Share any specific needs or goals for your organization..."
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Create Organization
            </Button>
            
            <Text className="text-center text-sm">
              By creating an account, you agree to our{' '}
              <TextLink href="/terms">
                <Strong>Terms of Service</Strong>
              </TextLink>{' '}
              and{' '}
              <TextLink href="/privacy">
                <Strong>Privacy Policy</Strong>
              </TextLink>
            </Text>

            <Text className="text-center">
              Already have an account?{' '}
              <TextLink href="/login">
                <Strong>Sign in</Strong>
              </TextLink>
            </Text>
          </div>
        </form>
      </div>
    </div>
  )
}