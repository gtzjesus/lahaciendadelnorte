// app/(admin)/orders/page.tsx
import { fetchOrders } from '@/app/services/admin/orders/ordersService';
import OrderList from '@/components/admin/orders/OrderList';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const { orders, success } = await fetchOrders();

  return (
    <main className="flex flex-col  mx-auto max-w-4xl">
      {!success ? (
        <p className="text-center text-red-300 uppercase font-light">
          Failed to fetch orders.
        </p>
      ) : (
        <OrderList orders={orders} />
      )}
    </main>
  );
}
