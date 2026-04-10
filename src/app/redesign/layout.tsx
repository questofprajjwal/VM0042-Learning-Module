import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './redesign.css';

// Fonts loaded via Next.js font loader. CSS variables are referenced in
// tailwind.config.ts under fontFamily.redesign-sans and redesign-mono.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Greentryst - The Professional Home for Sustainability',
    template: '%s - Greentryst',
  },
  description:
    'The professional operating system for sustainability practitioners. Learn new domains, verify answers with sourced citations, execute work with professional tools, advance your career.',
};

export default function RedesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} ${jetbrainsMono.variable} gt-redesign-root min-h-screen`}
      style={{
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
