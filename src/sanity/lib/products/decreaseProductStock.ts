import { backendClient } from '@/sanity/lib/backendClient';

/**
 * Decrease product stock atomically in Sanity after purchase.
 * Throws error if insufficient stock.
 *
 * @param productId - Sanity document ID for the product
 * @param quantity - Quantity to subtract from current stock
 */
export async function decreaseProductStock(
  productId: string,
  quantity: number
) {
  // Fetch current stock
  const product = await backendClient.fetch<{ stock: number }>(
    `*[_type == "product" && _id == $id][0]{stock}`,
    { id: productId }
  );

  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  const currentStock = product.stock ?? 0;

  if (quantity > currentStock) {
    throw new Error(
      `Insufficient stock for product ${productId}. Requested ${quantity}, available ${currentStock}`
    );
  }

  // Atomically decrement stock
  await backendClient.patch(productId).inc({ stock: -quantity }).commit();

  console.log(
    `📦 Stock updated for ${productId}: ${currentStock} → ${currentStock - quantity}`
  );
}
