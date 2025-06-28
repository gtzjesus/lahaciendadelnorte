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
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-2xl uppercase font-bold mb-6">Product Detail</h1>
      <InventoryCard product={product} allCategories={allCategories} />
    </div>
  );
}
