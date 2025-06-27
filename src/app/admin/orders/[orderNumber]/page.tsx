import { getOrderByOrderNumber } from '@/sanity/lib/orders/getOrderByOrderNumber';
import { notFound } from 'next/navigation';
import OrderCard from '@/components/orders/OrderCard';
/* eslint-disable  @typescript-eslint/no-explicit-any */
interface Order {
  orderNumber?: string;
  customerName?: string;
  totalPrice?: number;
  currency?: string;
  paymentStatus?: string;
  pickupStatus?: string;
  orderDate?: string;
  products?: any[];
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order: Order | null = await getOrderByOrderNumber(orderNumber);

  if (!order) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen p-6 border-flag-blue">
      <OrderCard order={order} showDetailButton={false} />
    </div>
  );
}
