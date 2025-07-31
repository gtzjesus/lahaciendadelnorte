import { getProductByItemNumber } from '@/sanity/lib/products/getProductByItemNumber';
import { notFound } from 'next/navigation';
import InventoryCard from '@/components/inventory/InventoryCard';
import { getAllCategories } from '@/sanity/lib/categories/getAllCategories';

interface Props {
  params: Promise<{ itemNumber: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { itemNumber } = await params;

  const product = await getProductByItemNumber(itemNumber);
  const allCategories = await getAllCategories();

  if (!product) return notFound();

  return (
    <div className="bg-white min-h-screen pt-6 px-2">
      <InventoryCard product={product} allCategories={allCategories} />
    </div>
  );
}
