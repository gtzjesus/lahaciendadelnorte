import { backendClient } from '@/sanity/lib/backendClient';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function decreaseProductStock(
  productId: string,
  variantSize: string,
  quantity: number
) {
  const product = await backendClient.fetch(`*[_id == $id][0]{ variants }`, {
    id: productId,
  });

  if (!product?.variants || !Array.isArray(product.variants)) {
    throw new Error('Product or variants not found.');
  }

  const variantIndex = product.variants.findIndex(
    (v: any) => v.size === variantSize
  );

  if (variantIndex === -1) {
    throw new Error(`Variant with size "${variantSize}" not found.`);
  }

  const variant = product.variants[variantIndex];
  const newStock = Math.max((variant.stock ?? 0) - quantity, 0);

  // Patch only the specific variant's stock
  await backendClient
    .patch(productId)
    .set({ [`variants[${variantIndex}].stock`]: newStock })
    .commit();
}
