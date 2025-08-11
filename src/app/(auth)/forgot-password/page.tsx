import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot password',
}

export default function ForgotPassword() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-sm">
        <form action="" method="POST" className="grid grid-cols-1 gap-8">
          <div className="grid gap-2">
            <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
            <Heading>Reset your password</Heading>
            <Text>Enter your email and we'll send you a link to reset your password.</Text>
          </div>
      <Field>
        <Label>Email</Label>
        <Input type="email" name="email" />
      </Field>
      <Button type="submit" className="w-full">
        Reset password
      </Button>
          <Text>
            Don't have an account?{' '}
            <TextLink href="/register">
              <Strong>Sign up</Strong>
            </TextLink>
          </Text>
        </form>
      </div>
    </div>
  )
}
