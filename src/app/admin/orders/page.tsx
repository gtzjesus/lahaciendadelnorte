// app/(admin)/orders/page.tsx
import { fetchOrders } from '@/app/services/admin/orders/ordersService';
import OrderList from '@/components/admin/orders/OrderList';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const { orders, success } = await fetchOrders();

  return (
    <div className="flex flex-col overflow-x-hidden  min-h-screen mx-auto max-w-xl">
      {!success ? (
        <p className="text-center text-red-300 uppercase font-light">
          Failed to fetch orders.
        </p>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
}
