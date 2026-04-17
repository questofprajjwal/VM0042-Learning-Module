/**
 * Nav
 *
 * Fixed top navigation bar. Two tone variants:
 * - "light" (default): pale/translucent with dark text, for light pages
 * - "dark": dark/translucent with light text, for pages that start with a
 *   dark hero
 *
 * Supports signed-in and signed-out auth state variants.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/components/redesign/lib/cn';
import { Logo } from '@/components/redesign/Logo';

type NavLink = {
  label: string;
  href: string;
  matchPrefix?: string;
};

const NAV_LINKS: NavLink[] = [
  { label: 'Learn', href: '/courses', matchPrefix: '/courses' },
  { label: 'SustainIQ', href: '/ask', matchPrefix: '/ask' },
  { label: 'Jobs', href: '/jobs', matchPrefix: '/jobs' },
  { label: 'Services', href: '/services', matchPrefix: '/services' },
  { label: 'Pricing', href: '/pricing', matchPrefix: '/pricing' },
];

export interface NavProps {
  /** Visual tone. Use "dark" when the page hero is a dark section. */
  tone?: 'light' | 'dark';
  /** Brand link destination */
  brandHref?: string;
  className?: string;
}

export function Nav({
  tone = 'light',
  brandHref = '/',
  className,
}: NavProps) {
  const pathname = usePathname() || '';
  const { isSignedIn } = useUser();

  const isDark = tone === 'dark';

  const navBg = isDark
    ? 'bg-gt-text-dark/90 border-b border-white/5'
    : 'bg-white/90 border-b border-gt-border-light';

  const brandColor = isDark ? 'text-white' : 'text-gt-text';
  const linkBase = isDark
    ? 'text-white hover:text-white/80'
    : 'text-gt-text-muted hover:text-gt-medium';
  const linkActive = isDark
    ? 'text-white border-b-2 border-white pb-1'
    : 'text-gt-medium border-b-2 border-gt-medium pb-1';
  const secondaryText = isDark
    ? 'text-white hover:text-white/80'
    : 'text-gt-text-muted hover:text-gt-medium';

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 backdrop-blur-md',
        navBg,
        className
      )}
    >
      <div className="flex justify-between items-center px-8 py-4 max-w-[1280px] mx-auto">
        <Logo variant={isDark ? 'dark' : 'light'} size="sm" href={brandHref} />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = link.matchPrefix
              ? pathname.startsWith(link.matchPrefix)
              : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-semibold transition-colors',
                  isActive ? linkActive : linkBase
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className={cn('text-sm font-semibold transition-colors', secondaryText)}
              >
                Dashboard
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: cn(
                      'w-9 h-9 border transition-colors',
                      isDark
                        ? 'border-gt-mint/30 hover:border-gt-mint'
                        : 'border-gt-medium/30 hover:border-gt-medium'
                    ),
                    userButtonPopoverCard: 'shadow-xl',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn('text-sm font-semibold transition-colors', secondaryText)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-gt-medium text-gt-text-light px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gt-dark transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
