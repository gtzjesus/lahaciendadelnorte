// src/app/store/layout.tsx

import type { Metadata } from 'next';
import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { draftMode } from 'next/headers';
import { DisableDraftMode } from '@/components/auth/DisableDraftMode';
import { VisualEditing } from 'next-sanity';
import { SanityLive } from '@/sanity/lib/live';
import ScrollToTop from '@/components/common/ScrollToTop';

/**
 * 🍧 Store Layout – La Dueña
 *
 * Layout wrapper for all `/store` routes.
 * Sets up providers and shared tooling for storefront.
 */

export const metadata: Metadata = {
  title: 'La Dueña | Shaved Ice, Ice Cream & Snacks – El Paso, TX',
  description:
    'Craving something cool or spicy? La Dueña offers shaved ice, ice cream, raspas, and authentic snacks in El Paso, TX.',
  keywords: [
    'La Dueña',
    'shaved ice El Paso',
    'raspas El Paso',
    'ice cream El Paso',
    'mexican snacks El Paso',
    'snack shop El Paso',
    'chamoy snacks',
    'El Paso treats',
    'La Dueña snack bar',
  ],
  openGraph: {
    title: 'La Dueña | El Paso’s Spot for Raspas & Snacks',
    description:
      'Visit La Dueña in El Paso for refreshing shaved ice, creamy ice cream, and tasty Mexican-style snacks. Order online or stop by!',
    url: 'https://laduena.store',
    siteName: 'La Dueña',
    images: [
      {
        url: '/images/laduena-preview.webp', // Replace with actual OG image
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
      'El Paso’s go-to spot for raspas, ice cream, and authentic Mexican snacks. La Dueña keeps it cool!',
    images: ['/images/laduena-preview.webp'], // Replace with actual OG image
  },
};

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();

  return (
    <ClerkProvider dynamic>
      {isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}

      <ScrollToTop />

      <main>{children}</main>

      <SanityLive />
    </ClerkProvider>
  );
}
