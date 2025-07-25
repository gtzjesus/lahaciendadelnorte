// app/(store)/page.tsx

import { client } from '@/sanity/lib/client';
import HeroSection from '@/components/common/HeroSection';
import BlackFridayBanner from '@/components/common/BlackFridayBanner';
import Footer from '@/components/common/Footer';
import Categories from '@/components/categories/Categories';
import Header from '@/components/common/header';
import Background from '@/components/common/Background';
import { Category } from '@/types';
import Script from 'next/script';
import type { Metadata } from 'next';
import PickupLocation from '@/components/orders/PickupLocation';

export const metadata: Metadata = {
  title: 'La Dueña - Shaved Ice, Ice Cream & Snacks in Canutillo, TX',
  description:
    'La Dueña offers delicious shaved ice, creamy ice cream, and authentic Mexican snacks in Canutillo, Texas. Refresh yourself today!',
  keywords: [
    'La Dueña',
    'shaved ice Canutillo',
    'raspas Canutillo',
    'ice cream Canutillo',
    'snacks Canutillo',
    'Mexican snacks',
    'Chamoy snacks',
  ],
  authors: [{ name: 'La Dueña', url: 'https://laduena.store' }],
  openGraph: {
    title: 'La Dueña - Shaved Ice & Snacks in Canutillo, TX',
    description:
      'Cool off with La Dueña’s shaved ice, ice cream, and tasty snacks in Canutillo, Texas.',
    url: 'https://laduena.store',
    siteName: 'La Dueña',
    type: 'website',
    images: [
      {
        url: '/images/laduena-preview.webp', // Replace with your actual image
        width: 1200,
        height: 630,
        alt: 'La Dueña shaved ice and snacks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Dueña - Shaved Ice & Snacks in Canutillo, TX',
    description:
      'Enjoy the best shaved ice, ice cream, and snacks at La Dueña in Canutillo, Texas.',
    images: ['/images/laduena-preview.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://laduena.store',
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
      <Background />
      <HeroSection />
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
