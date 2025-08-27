import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { SanityLive } from '@/sanity/lib/live';
import ErrorBoundary from '@/components/errors/ErrorBoundary';
import HtmlWithTheme from '@/lib/HtmlWithTheme';

export const metadata: Metadata = {
  title: {
    default: 'La Dueña',
    template: '%s | La Dueña',
  },
  description:
    'La Dueña serves refreshing shaved ice, delicious ice cream, and snacks in Canutillo, TX. Visit us or order online!',
  authors: [{ name: 'La Dueña', url: 'https://laduena.store' }],
  metadataBase: new URL('https://laduena.store'),
  keywords: [
    'La Dueña Canutillo',
    'shaved ice Canutillo',
    'ice cream Canutillo',
    'snack shop Canutillo',
    'raspas Canutillo',
    'chamoy snacks',
    'Canutillo snacks',
    'mexican snacks Canutillo',
    'La Dueña shaved ice',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'La Dueña | Shaved Ice, Ice Cream & Snacks – Canutillo, TX',
    description:
      'Your go-to spot in Canutillo for shaved ice, ice cream, raspas, and tasty snacks. Cool off and treat yourself!',
    url: 'https://laduena.store',
    siteName: 'La Dueña',
    images: [
      {
        url: '/images/laduena-preview.webp',
        width: 1200,
        height: 630,
        alt: 'La Dueña Shaved Ice & Snacks',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Dueña | Shaved Ice, Ice Cream & Snacks – Canutillo, TX',
    description:
      'Craving something sweet or spicy? La Dueña has shaved ice, ice cream, and Mexican-style snacks in Canutillo!',
    images: ['/images/laduena-preview.webp'],
  },
};

export const viewport = {
  themeColor: '#1F2937',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        {/* Load Rubik Distressed font globally */}
      </head>
      <body className="min-h-screen bg-flag-red text-black transition-colors duration-300">
        <HtmlWithTheme>
          <ClerkProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
            <SanityLive />
          </ClerkProvider>
        </HtmlWithTheme>
      </body>
    </html>
  );
}
