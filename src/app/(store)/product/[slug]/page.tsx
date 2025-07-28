import Header from '@/components/common/header';
import InfoDropdown from '@/components/common/InfoDropdown';
import ProductImages from '@/components/products/ProductImages';
import ProductSummary from '@/components/products/ProductSummary';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { notFound } from 'next/navigation';
import { imageUrl } from '@/lib/imageUrl';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | La Dueña',
      description: 'Sorry, this product does not exist.',
    };
  }

  const fallbackDescription =
    product.description?.slice(0, 150) ||
    'Browse our delicious items at La Dueña.';

  const productImageUrl = product.image
    ? imageUrl(product.image).width(1200).height(630).url()
    : '/default-og.jpg';

  return {
    title: `${product.name} | La Dueña`,
    description: fallbackDescription,
    openGraph: {
      title: `${product.name} | La Dueña`,
      description: fallbackDescription,
      images: [
        {
          url: productImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | La Dueña`,
      description: fallbackDescription,
      images: [productImageUrl],
    },
    alternates: {
      canonical: `https://laduena.store/products/${product.slug?.current}`,
    },
  };
}

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="w-full bg-flag-red">
        <h1 className="uppercase text-sm font-light text-center p-5 text-white">
          {product.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Images + Info */}
        <div className="relative flex-grow overflow-y-auto pb-40">
          <ProductImages product={product} isOutOfStock={isOutOfStock} />

          <InfoDropdown title="Details" info={product.description ?? ''} />

          {/* Show flavors if any */}
          {product.flavors?.length ? (
            <InfoDropdown title="Flavors" info={product.flavors.join(', ')} />
          ) : null}

          {/* Show sizes if any */}
          {/* Show variants if any */}
          {product.variants?.length ? (
            <InfoDropdown
              title="Sizes"
              info={product.variants
                .map(
                  (variant) => `${variant.size} ($${variant.price.toFixed(2)})`
                )
                .join(', ')}
            />
          ) : null}

          {isOutOfStock && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-40">
              <span className="text-white font-mono text-sm uppercase">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <ProductSummary product={product} isOutOfStock={isOutOfStock} />
      </div>
    </div>
  );
}

export default ProductPage;
