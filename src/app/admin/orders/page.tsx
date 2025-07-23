import OrderCard from '@/components/orders/OrderCard';

export const dynamic = 'force-dynamic';
/* eslint-disable  @typescript-eslint/no-explicit-any */

export default async function AdminOrdersPage() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-all-orders`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const { success, orders = [] } = await res.json();

    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <h1 className="uppercase text-xl font-semibold mb-6">All Orders</h1>

        {!success ? (
          <p className="text-center text-red-600 uppercase font-light">
            Failed to fetch orders.
          </p>
        ) : orders.length === 0 ? (
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
  } catch (err: any) {
    console.error('❌ Server render error in AdminOrdersPage:', err);

    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <h1 className="uppercase text-xl font-semibold mb-6">All Orders</h1>
        <p className="text-center text-red-600 uppercase font-light">
          Server error occurred: check logs
        </p>
      </div>
    );
  }
}
