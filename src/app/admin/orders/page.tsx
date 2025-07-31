// app/(admin)/orders/page.tsx
import { fetchOrders } from '@/app/services/admin/orders/ordersService';
import OrderList from '@/components/admin/orders/OrderList';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const { orders, success } = await fetchOrders();

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
