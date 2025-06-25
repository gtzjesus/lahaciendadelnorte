import Header from '@/components/common/header';
import { getAllOrders } from '@/sanity/lib/orders/getAllOrders';
import OrderCard from '@/components/orders/OrderCard';

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  interface ProductRef {
    _id: string;
    name: string;
    slug?: { current: string };
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    image?: any; // you can type it more strictly if you want
    price?: number;
  }

  interface OrderProduct {
    quantity: number;
    product: ProductRef;
  }

  interface Order {
    _id: string;
    orderNumber: string;
    clerkUserId?: string;
    customerName: string;
    email: string;
    products: OrderProduct[];
    totalPrice: number;
    currency: string;
    amountDiscount?: number;
    orderType?: string;
    paymentStatus: string;
    pickupStatus: string;
    orderDate: string;
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen p-6">
        <h1 className="uppercase text-xl font-semibold mb-6">All Orders</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600 uppercase tracking-wide font-light">
            No orders found.
          </p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order: Order) => (
              <OrderCard key={order.orderNumber || order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
