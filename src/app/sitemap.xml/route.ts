// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client'; // Adjust path if needed

export async function GET() {
  const baseUrl = 'laduenaice@gmail.com';

  // Static pages you want indexed
  const staticRoutes = ['', '/search?q=*', '/contact', '/categories'];

  // 1. Fetch category slugs from Sanity
  const categories = await client.fetch(`
    *[_type == "category"]{
      "slug": slug.current
    }
  `);

  // 2. Build dynamic URLs
  const dynamicRoutes = categories.map(
    (cat: { slug: string }) => `/categories/${cat.slug}`
  );

  // 3. Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // 4. Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
    </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
