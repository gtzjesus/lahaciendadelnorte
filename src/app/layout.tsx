// app/layout.tsx

import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { SanityLive } from '@/sanity/lib/live';
import ErrorBoundary from '@/components/errors/ErrorBoundary';

export const metadata: Metadata = {
  title: {
    default: 'La Dueña',
    template: '%s | La Dueña',
  },
  description:
    'La Dueña serves refreshing shaved ice, delicious ice cream, and snacks in El Paso, TX. Visit us or order online!',
  authors: [{ name: 'La Dueña', url: 'https://laduena.store' }],
  metadataBase: new URL('https://laduena.store'),
  keywords: [
    'La Dueña El Paso',
    'shaved ice El Paso',
    'ice cream El Paso',
    'snack shop El Paso',
    'raspas El Paso',
    'chamoy snacks',
    'el paso snacks',
    'mexican snacks El Paso',
    'La Dueña shaved ice',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'La Dueña | Shaved Ice, Ice Cream & Snacks – El Paso, TX',
    description:
      'Your go-to spot in El Paso for shaved ice, ice cream, raspas, and tasty snacks. Cool off and treat yourself!',
    url: 'https://laduena.store',
    siteName: 'La Dueña',
    images: [
      {
        url: '/images/laduena-preview.webp', // Replace with your real image
        width: 1200,
        height: 630,
        alt: 'La Dueña Shaved Ice & Snacks',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Dueña | Shaved Ice, Ice Cream & Snacks – El Paso, TX',
    description:
      'Craving something sweet or spicy? La Dueña has shaved ice, ice cream, and Mexican-style snacks in El Paso!',
    images: ['/images/laduena-preview.webp'], // Replace with your real image
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
          <SanityLive />
        </ClerkProvider>
      </body>
    </html>
  );
}
