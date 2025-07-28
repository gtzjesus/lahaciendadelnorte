// app/(admin)/orders/page.tsx
import OrderList from '@/components/orders/OrderList'; // <- we'll create this
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
    <div className="bg-white min-h-screen p-6">
      <h1 className="uppercase text-xl font-semibold mb-6">Orders</h1>

      {!success ? (
        <p className="text-center text-red-600 uppercase font-light">
          Failed to fetch orders.
        </p>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
}
