import { client } from '../client';

export async function getAllOrders() {
  const query = `
    *[_type == "order"] | order(orderDate desc) {
      _id,
      orderNumber,
      clerkUserId,
      customerName,
      email,
      products[] {
        quantity,
        itemNumber,
        product->{
          _id,
          name,
          slug,
          image,
          price
        }
      },
      totalPrice,
      tax,
      currency,
      amountDiscount,
      orderType,
      paymentStatus,
      pickupStatus,
      orderDate,

      // ✅ Campos de pago agregados
   
    }
  `;

  try {
    const orders = await client.fetch(query);
    return orders;
  } catch (err) {
    console.error('❌ Failed to fetch orders:', err);
    return [];
  }
}
