/**
 * RedesignNav
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
import { cn } from '@/components/redesign/lib/cn';

type NavLink = {
  label: string;
  href: string;
  matchPrefix?: string;
};

const NAV_LINKS: NavLink[] = [
  { label: 'Learn', href: '/redesign/learn', matchPrefix: '/redesign/learn' },
  { label: 'SustainIQ', href: '/redesign/ask', matchPrefix: '/redesign/ask' },
  { label: 'Career', href: '/redesign/jobs', matchPrefix: '/redesign/jobs' },
  { label: 'Tools', href: '/redesign/tools', matchPrefix: '/redesign/tools' },
  { label: 'Pricing', href: '/redesign/pricing', matchPrefix: '/redesign/pricing' },
];

export interface RedesignNavProps {
  /** Signed-in state renders Dashboard link + user avatar */
  signedIn?: boolean;
  /** Visual tone. Use "dark" when the page hero is a dark section. */
  tone?: 'light' | 'dark';
  /** Brand link destination */
  brandHref?: string;
  className?: string;
}

export function RedesignNav({
  signedIn = false,
  tone = 'light',
  brandHref = '/redesign',
  className,
}: RedesignNavProps) {
  const pathname = usePathname() || '';

  const isDark = tone === 'dark';

  const navBg = isDark
    ? 'bg-gt-text-dark/90 border-b border-white/5'
    : 'bg-white/90 border-b border-gt-border-light';

  const brandColor = isDark ? 'text-gt-text-light' : 'text-gt-text';
  const linkBase = isDark
    ? 'text-gt-mint/70 hover:text-gt-text-light'
    : 'text-gt-text-muted hover:text-gt-medium';
  const linkActive = isDark
    ? 'text-gt-mint border-b-2 border-gt-mint pb-1'
    : 'text-gt-medium border-b-2 border-gt-medium pb-1';
  const secondaryText = isDark
    ? 'text-gt-mint/70 hover:text-gt-text-light'
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
        <Link
          href={brandHref}
          className={cn(
            'text-xl font-extrabold tracking-tighter transition-colors',
            brandColor
          )}
          style={{ letterSpacing: '-0.02em' }}
        >
          Greentryst
        </Link>

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
          {signedIn ? (
            <>
              <Link
                href="/redesign/dashboard"
                className={cn('text-sm font-semibold transition-colors', secondaryText)}
              >
                Dashboard
              </Link>
              <button
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                  isDark
                    ? 'bg-gt-deep border border-gt-mint/30 text-gt-mint hover:border-gt-mint'
                    : 'bg-white border border-gt-medium/30 text-gt-medium hover:border-gt-medium'
                )}
                aria-label="Account menu"
              >
                P
              </button>
            </>
          ) : (
            <>
              <Link
                href="/redesign/sign-in"
                className={cn('text-sm font-semibold transition-colors', secondaryText)}
              >
                Sign In
              </Link>
              <Link
                href="/redesign/sign-up"
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
