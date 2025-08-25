// app/(store)/page.tsx

import { client } from '@/sanity/lib/client';
import HeroSection from '@/components/(store)/common/HeroSection';
import BlackFridayBanner from '@/components/(store)/common/BlackFridayBanner';
import Footer from '@/components/(store)/common/Footer';
import Categories from '@/components/categories/Categories';
import Header from '@/components/(store)/common/header';
import Background from '@/components/(store)/common/Background';
import { Category } from '@/types';
import Script from 'next/script';
import type { Metadata } from 'next';
import PickupLocation from '@/components/orders/PickupLocation';

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
        url: '/images/lahacienda-preview.webp', // Make sure this image exists in your public folder
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

const Home = async () => {
  const categories: Category[] = await client.fetch('*[_type == "category"]');

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: categories.map((cat, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cat.title,
      url: `https://laduena.store/categories/${cat.slug.current}`,
    })),
  };

  return (
    <div>
      <Header />
      <div className="relative w-full h-screen ">
        <Background className="absolute inset-0 z-0" />
        <HeroSection className="absolute inset-0 z-10" />
      </div>
      <BlackFridayBanner />
      <Categories categories={categories} />
      <PickupLocation />
      <Footer />

      <Script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        strategy="afterInteractive"
      />
    </div>
  );
};

export default Home;
