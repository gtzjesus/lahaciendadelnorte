// /app/admin/orders/[orderNumber]/page.tsx

import OrderCard from '@/components/orders/OrderCard';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
}: {
  params: { orderNumber: string }; // ❗ THIS is correct — no `Promise`!
}) {
  const { orderNumber } = params;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000';

  let order = null;
  let success = false;

  try {
    const res = await fetch(
      `${baseUrl}/api/get-order?orderNumber=${orderNumber}`,
      { cache: 'no-store' }
    );

    const json = await res.json();
    order = json.order;
    success = json.success;
  } catch (err) {
    console.error('❌ Error fetching order:', err);
  }

  if (!success || !order) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="uppercase text-xl font-semibold mb-6">
        Order #{order.orderNumber}
      </h1>
      <OrderCard order={order} showDetailButton={false} />
    </div>
  );
}
