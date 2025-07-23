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
      _key,
      quantity,
      itemNumber,
      price,
      variant,
      product->{
        _id,
        name,
        slug,
        image,
        itemNumber,
        stock,
        category->{
          title
        }
      }
    },
    totalPrice,
    tax,
    currency,
    amountDiscount,
    orderType,
    paymentStatus,
    pickupStatus,
    orderDate
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
