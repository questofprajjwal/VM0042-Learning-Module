import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';
import MigrationBanner from '@/components/platform/MigrationBanner';
import './globals.css';
import './redesign.css';

const siteUrl = 'https://greentryst.com';

// Fonts for the redesign. CSS variables are referenced in tailwind.config.ts
// under fontFamily.redesign-sans and redesign-mono.
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Greentryst - The Professional Home for Sustainability',
    template: '%s - Greentryst',
  },
  description:
    'The professional operating system for sustainability practitioners. Learn new domains, verify answers with sourced citations, execute work with professional tools, advance your career.',
  keywords: [
    'sustainability', 'ESG', 'carbon markets', 'climate science', 'GHG accounting',
    'Scope 1', 'Scope 2', 'Scope 3', 'carbon credits', 'TCFD', 'IFRS S2', 'SBTi',
    'net zero', 'green finance', 'SFDR', 'EU Taxonomy', 'CSRD', 'PCAF',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Greentryst',
    title: 'Greentryst - The Professional Home for Sustainability',
    description:
      'The professional operating system for sustainability practitioners. Learn new domains, verify answers with sourced citations, execute work with professional tools, advance your career.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greentryst - The Professional Home for Sustainability',
    description:
      'The professional operating system for sustainability practitioners.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SGMKCB3SRY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SGMKCB3SRY');
          `}
        </Script>
      </head>
      <body
        className="gt-redesign-root min-h-screen flex flex-col bg-gray-50"
        style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}
      >
        <ClerkProvider>
          <MigrationBanner />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
