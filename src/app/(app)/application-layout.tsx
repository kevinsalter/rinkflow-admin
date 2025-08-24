'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  LightBulbIcon,
} from '@heroicons/react/16/solid'
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  CreditCardIcon,
  Cog6ToothIcon,
} from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

function AccountDropdownMenu({ anchor, onSignOut }: { anchor: 'top start' | 'bottom end', onSignOut: () => void }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/settings">
        <Cog6ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="mailto:feedback@rinkflow.com">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={onSignOut}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (!user) return
        
        // Try to get avatar from user metadata first (OAuth providers often set this)
        let foundAvatar = null
        if (user.user_metadata?.avatar_url) {
          foundAvatar = user.user_metadata.avatar_url
        } else if (user.user_metadata?.picture) {
          foundAvatar = user.user_metadata.picture
        }
        
        // If no avatar in metadata, try to fetch from user_profiles table
        if (!foundAvatar) {
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('avatar_url, social_avatar_url')
            .eq('id', user.id)
            .maybeSingle()
          
          if (!error && profile) {
            foundAvatar = profile.avatar_url || profile.social_avatar_url || null
          }
        }
        
        setAvatarUrl(foundAvatar)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (!session?.user) {
        setAvatarUrl(null)
        return
      }
      
      // Set avatar from user metadata
      let foundAvatar = null
      if (session.user.user_metadata?.avatar_url) {
        foundAvatar = session.user.user_metadata.avatar_url
      } else if (session.user.user_metadata?.picture) {
        foundAvatar = session.user.user_metadata.picture
      }
      
      // If no avatar in metadata, try to fetch from user_profiles table
      if (!foundAvatar) {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('avatar_url, social_avatar_url')
          .eq('id', session.user.id)
          .maybeSingle()
        
        if (!error && profile) {
          foundAvatar = profile.avatar_url || profile.social_avatar_url || null
        }
      }
      
      setAvatarUrl(foundAvatar)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Generate initials from email for fallback avatar
  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <div className="size-10">
                  <Avatar 
                    src={avatarUrl} 
                    initials={user?.email ? getInitials(user.email) : 'U'}
                    square 
                  />
                </div>
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" onSignOut={handleSignOut} />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2.5">
              <span className="font-black text-xl" style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '-0.03em'
              }}>
                Rinkflow Admin
              </span>
            </Link>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard" current={pathname === '/dashboard'}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/coaches" current={pathname.startsWith('/coaches')}>
                <UserGroupIcon />
                <SidebarLabel>Coaches</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/billing" current={pathname.startsWith('/billing')}>
                <CreditCardIcon />
                <SidebarLabel>Billing</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="mailto:support@rinkflow.com">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/changelog" current={pathname.startsWith('/changelog')}>
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar 
                    src={avatarUrl} 
                    initials={user?.email ? getInitials(user.email) : 'U'}
                    className="size-10" 
                    square 
                    alt="" 
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {user?.email || 'Loading...'}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" onSignOut={handleSignOut} />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
