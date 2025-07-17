import { getAllOrders } from '@/sanity/lib/orders/getAllOrders';
import OrderCard from '@/components/orders/OrderCard';
// import DeleteButton from '@/components/orders/DeleteButton';

export const dynamic = 'force-dynamic'; // For real-time updates
/* eslint-disable  @typescript-eslint/no-explicit-any */

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="uppercase text-xl font-semibold mb-6">All Orders</h1>

      {/* Delete All Orders Button */}
      {/* <DeleteButton /> */}

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 uppercase tracking-wide font-light">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order: any) => (
            <OrderCard key={order.orderNumber || order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
