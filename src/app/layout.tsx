// app/layout.tsx

import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { SanityLive } from '@/sanity/lib/live'; // Optional if you want global live updates
import ErrorBoundary from '@/components/errors/ErrorBoundary';

export const metadata: Metadata = {
  title: {
    default: 'ElPasoKaBoom',
    template: '%s | ElPasoKaBoom',
  },
  description:
    'Buy fireworks online in El Paso, TX. Shop legal, high-quality fireworks and party supplies from ElPasoKaBoom. Celebrate safely and in style!',
  authors: [{ name: 'ElPasoKaBoom', url: 'https://elpasokaboom.com' }],
  metadataBase: new URL('https://elpasokaboom.com'),
  keywords: [
    'fireworks El Paso',
    'ElPasoKaBoom',
    'El Paso fireworks shop',
    'buy fireworks online',
    'Texas fireworks',
    'party supplies El Paso',
    '4th of July El Paso',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'ElPasoKaBoom | Fireworks for El Paso, TX',
    description:
      'Shop high-quality, legal fireworks in El Paso. Perfect for July 4th, New Year’s, and epic celebrations. Fast local pickup!',
    url: 'https://elpasokaboom.com',
    siteName: 'ElPasoKaBoom',
    images: [
      {
        url: '/images/elpaso.webp',
        width: 1200,
        height: 630,
        alt: 'ElPasoKaBoom Fireworks',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElPasoKaBoom | Fireworks for El Paso, TX',
    description:
      'Legal, quality fireworks in El Paso — shop online at ElPasoKaBoom!',
    images: ['/images/elpaso.webp'],
  },
};

export const viewport = {
  themeColor: '#ffffff',
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
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-white text-black">
        <ClerkProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
          <SanityLive />{' '}
          {/* Optional: only if you want global Sanity live updates */}
        </ClerkProvider>
      </body>
    </html>
  );
}
