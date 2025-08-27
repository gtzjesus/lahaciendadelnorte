// src/app/store/layout.tsx

import type { Metadata } from 'next';
import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { draftMode } from 'next/headers';
import { DisableDraftMode } from '@/components/auth/DisableDraftMode';
import { VisualEditing } from 'next-sanity';
import { SanityLive } from '@/sanity/lib/live';
import ScrollToTop from '@/components/(store)/common/ScrollToTop';

import Header from '@/components/(store)/common/header';
import Footer from '@/components/(store)/common/Footer';

export const metadata: Metadata = {
  title: 'La Hacienda Del Norte - Custom Storage & More in El Paso, TX',
  description:
    'La Hacienda Del Norte offers customizable storage solutions and more in El Paso, Texas. Explore our unique storage options or create your own!',
  keywords: [
    'La Hacienda Del Norte',
    'custom storage El Paso',
    'storage solutions El Paso',
    'El Paso storage units',
    'build your own storage',
    'modular storage El Paso',
  ],
  authors: [
    {
      name: 'La Hacienda Del Norte',
      url: 'https://lahaciendadelnorte.vercel.app',
    },
  ],
  openGraph: {
    title: 'La Hacienda Del Norte - Custom Storage Solutions in El Paso, TX',
    description:
      'Explore personalized and modular storage solutions at La Hacienda Del Norte in El Paso. Perfect for every need!',
    url: 'https://lahaciendadelnorte.vercel.app',
    siteName: 'La Hacienda Del Norte',
    type: 'website',
    images: [
      {
        url: '/images/lahacienda-preview.webp',
        width: 1200,
        height: 630,
        alt: 'Custom storage solutions at La Hacienda Del Norte',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Hacienda Del Norte - Storage Options in El Paso, TX',
    description:
      'Design your perfect storage space with La Hacienda Del Norte. Serving El Paso with custom and pre-built options.',
    images: ['/images/lahacienda-preview.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://lahaciendadelnorte.com',
  },
};

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <ClerkProvider>
      {isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}

      <ScrollToTop />

      {/* Shared Header */}
      <Header />

      <main>{children}</main>

      {/* Shared Footer */}
      <Footer />

      <SanityLive />
    </ClerkProvider>
  );
}
