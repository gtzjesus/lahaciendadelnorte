import DeleteButton from '@/components/orders/DeleteButton';
import OrderCard from '@/components/orders/OrderCard';

export const dynamic = 'force-dynamic';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export default async function AdminOrdersPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000';

  let orders = [];
  let success = false;

  try {
    const res = await fetch(`${baseUrl}/api/get-all-orders`, {
      cache: 'no-store',
    });

    const json = await res.json();
    orders = json.orders || [];
    success = json.success;
  } catch (err) {
    console.error('❌ Server render error in AdminOrdersPage:', err);
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="uppercase text-xl font-semibold mb-6">All Orders</h1>
      <DeleteButton />

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
}
