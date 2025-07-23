import OrderCard from '@/components/orders/OrderCard';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage(props: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { params } = props;
  const { orderNumber } = await params;

  let order = null;
  let success = false;

  try {
    // Replace with your actual API URL if different:
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/get-order?orderNumber=${orderNumber}`,
      { cache: 'no-store' }
    );

    const json = await res.json();
    order = json.order;
    success = json.success;
  } catch (err) {
    console.error('❌ Error fetching order from API:', err);
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
