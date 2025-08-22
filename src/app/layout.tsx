import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    template: '%s | Rinkflow Admin',
    default: 'Sign In | Rinkflow Admin',
  },
  description: 'Admin portal for managing your hockey organization, teams, coaches, and settings.',
  keywords: ['hockey', 'organization management', 'team management', 'admin portal', 'rinkflow'],
  authors: [{ name: 'Rinkflow' }],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Rinkflow Admin Portal',
    description: 'Secure admin access for hockey organization management',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#18181b" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
