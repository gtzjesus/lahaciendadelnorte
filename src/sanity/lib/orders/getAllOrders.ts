import { client } from '../client';

export async function getAllOrders() {
  const query = `*[_type == "order"] | order(orderDate desc) {
    _id,
    orderNumber,
    clerkUserId,
    customerName,
    email,
    products[] {
      quantity,
      product-> {
        _id,
        name,
        slug,
        image,
        price,
      }
    },
    totalPrice,
    currency,
    amountDiscount,
    orderType,
    paymentStatus,
    pickupStatus,
    orderDate
  }`;

  const orders = await client.fetch(query);
  return orders;
}
