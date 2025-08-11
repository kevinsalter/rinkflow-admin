import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text, TextLink, Strong } from '@/components/text'
import { Badge } from '@/components/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accept Invitation - Rinkflow',
  description: 'Accept your invitation to join a hockey organization on Rinkflow.',
}

export default function AcceptInvitation() {
  // In a real app, this would be fetched based on the invitation token
  const invitationData = {
    organizationName: 'Metro Hockey Club',
    inviterName: 'John Smith',
    inviterRole: 'Head Coach',
    teamName: 'U16 AAA Eagles',
    role: 'Assistant Coach',
  }

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="grid grid-cols-1 gap-8">
          <div className="grid gap-2 text-center">
            <Logo className="h-6 mx-auto text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
            <Heading>You're Invited!</Heading>
            <Text>
              <Strong>{invitationData.inviterName}</Strong> has invited you to join
            </Text>
          </div>

          {/* Invitation Details Card */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="text-center">
              <Subheading className="text-xl mb-1">
                {invitationData.organizationName}
              </Subheading>
              <Badge color="zinc">{invitationData.teamName}</Badge>
            </div>
            
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <Text className="text-zinc-600 dark:text-zinc-400">Your Role:</Text>
                  <Strong>{invitationData.role}</Strong>
                </div>
                <div className="flex justify-between">
                  <Text className="text-zinc-600 dark:text-zinc-400">Invited by:</Text>
                  <Strong>{invitationData.inviterName}</Strong>
                </div>
                <div className="flex justify-between">
                  <Text className="text-zinc-600 dark:text-zinc-400">Team:</Text>
                  <Strong>{invitationData.teamName}</Strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <form action="" method="POST" className="grid gap-6">
            <Subheading>Create Your Account</Subheading>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
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

            <Button type="submit" className="w-full">
              Accept Invitation & Create Account
            </Button>

            <Text className="text-center text-sm">
              Already have an account?{' '}
              <TextLink href="/login">
                <Strong>Sign in</Strong>
              </TextLink>{' '}
              to accept this invitation
            </Text>
          </form>

          {/* Alternative Actions */}
          <div className="text-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Text className="text-sm text-zinc-600 dark:text-zinc-400">
              Not interested?{' '}
              <TextLink href="/invitations/decline">
                <Strong>Decline invitation</Strong>
              </TextLink>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}