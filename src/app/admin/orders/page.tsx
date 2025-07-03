import { getAllOrders } from '@/sanity/lib/orders/getAllOrders';
import OrderCard from '@/components/orders/OrderCard';
import { formatCurrency } from '@/lib/formatCurrency';

export const dynamic = 'force-dynamic'; // For real-time updates

/* eslint-disable  @typescript-eslint/no-explicit-any */
export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  // Calculate total sales
  const totalSales = orders.reduce((acc: number, order: any) => {
    return acc + (typeof order.totalPrice === 'number' ? order.totalPrice : 0);
  }, 0);

  const fifteenPercent = totalSales * 0.15;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="uppercase text-xl font-semibold mb-2">All Orders</h1>

      {/* Display total sales */}
      <div className="uppercase mb-4 text-xs font-semibold text-flag-blue">
        Total Sales:{' '}
        <strong className="text-green">
          ({formatCurrency(totalSales, orders[0]?.currency || 'usd')})
        </strong>
        <br />
        15%:{' '}
        <strong className="text-flag-blue">
          ({formatCurrency(fifteenPercent, orders[0]?.currency || 'usd')})
        </strong>
      </div>

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
