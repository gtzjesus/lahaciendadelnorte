import { getProductByItemNumber } from '@/sanity/lib/products/getProductByItemNumber';
import { notFound } from 'next/navigation';
import { getAllCategories } from '@/sanity/lib/categories/getAllCategories';
import InventoryCard from '@/components/admin/inventory/InventoryCard';

interface Props {
  params: Promise<{ itemNumber: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { itemNumber } = await params;

  const product = await getProductByItemNumber(itemNumber);
  const allCategories = await getAllCategories();

  if (!product) return notFound();

  return (
    <div className=" min-h-screen py-6 px-2">
      <p className="text-sm text-center mb-5 dark:text-flag-red">
        Go ahead — make any changes or updates to this item
      </p>
      <InventoryCard product={product} allCategories={allCategories} />
    </div>
  );
}
