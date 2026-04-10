/**
 * RedesignFooter
 *
 * Three-column footer used across all redesign pages. Dark background
 * using the deep brand color, clean links, mono copyright line.
 */

import Link from 'next/link';
import { cn } from '@/components/redesign/lib/cn';

type FooterLink = { label: string; href: string };

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Learn', href: '/redesign/learn' },
      { label: 'SustainIQ', href: '/redesign/ask' },
      { label: 'Career', href: '/redesign/jobs' },
      { label: 'Tools', href: '/redesign/tools' },
      { label: 'Pricing', href: '/redesign/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Glossary', href: '/redesign/glossary' },
      { label: 'Blog', href: '/redesign/blog' },
      { label: 'Changelog', href: '/redesign/changelog' },
      { label: 'Documentation', href: '/redesign/docs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/redesign/about' },
      { label: 'Contact', href: '/redesign/contact' },
      { label: 'Privacy', href: '/redesign/privacy' },
      { label: 'Terms', href: '/redesign/terms' },
    ],
  },
];

export interface RedesignFooterProps {
  className?: string;
}

export function RedesignFooter({ className }: RedesignFooterProps) {
  return (
    <footer
      className={cn(
        'bg-gt-text-dark text-gt-text-light border-t border-gt-medium/20 pt-20 pb-10',
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link
              href="/redesign"
              className="text-2xl font-extrabold tracking-tighter text-gt-text-light hover:text-gt-mint transition-colors"
              style={{ letterSpacing: '-0.02em' }}
            >
              Greentryst
            </Link>
            <p className="mt-4 text-sm text-gt-mint/70 leading-relaxed max-w-xs">
              The professional operating system for sustainability practitioners.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3
                className="text-[11px] font-bold uppercase text-gt-leaf/80 mb-4"
                style={{ letterSpacing: '0.2em' }}
              >
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gt-mint/80 hover:text-gt-text-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-10 border-t border-gt-medium/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-xs text-gt-mint/60"
            style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
          >
            2026 Greentryst. Built for sustainability professionals.
          </p>
          <p
            className="text-xs text-gt-mint/60"
            style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
          >
            Every claim sourced. Every answer defensible.
          </p>
        </div>
      </div>
    </footer>
  );
}
