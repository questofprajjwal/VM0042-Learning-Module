import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';
import MigrationBanner from '@/components/platform/MigrationBanner';
import './globals.css';

const siteUrl = 'https://sustainabilityacademy.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Green Tryst - Sustainability Academy',
    template: '%s - Green Tryst',
  },
  description:
    'Expert-authored courses covering the full spectrum of sustainability - climate science, carbon markets, ESG, clean energy, biodiversity, circular economy, and more.',
  keywords: [
    'sustainability', 'ESG', 'carbon markets', 'climate science', 'GHG accounting',
    'Scope 1', 'Scope 2', 'Scope 3', 'carbon credits', 'TCFD', 'IFRS S2', 'SBTi',
    'net zero', 'green finance', 'SFDR', 'EU Taxonomy', 'CSRD', 'PCAF',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Green Tryst - Sustainability Academy',
    title: 'Green Tryst - Sustainability Academy',
    description:
      'Free, expert-authored courses on climate science, carbon markets, ESG reporting, GHG accounting, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Green Tryst - Sustainability Academy',
    description:
      'Free, expert-authored courses on climate science, carbon markets, ESG reporting, GHG accounting, and more.',
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
    <html lang="en">
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
      <body className="min-h-screen flex flex-col bg-gray-50">
        <ClerkProvider>
          <MigrationBanner />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
