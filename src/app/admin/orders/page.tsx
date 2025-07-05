import { getAllOrders } from '@/sanity/lib/orders/getAllOrders';
import OrderCard from '@/components/orders/OrderCard';
import { formatCurrency } from '@/lib/formatCurrency';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic'; // For real-time updates

interface Order {
  _id: string;
  totalPrice: number;
  currency?: string;
  orderDate?: string;
  // ...add any other fields your OrderCard expects
}

export default async function AdminOrdersPage() {
  const orders: Order[] = await getAllOrders();

  // ✅ Remove duplicate orders by _id
  const uniqueOrders = Array.from(
    new Map(orders.map((order) => [order._id, order])).values()
  );

  // Group by date
  const dailySalesMap: Record<string, number> = {};

  uniqueOrders.forEach((order) => {
    if (order.orderDate && typeof order.totalPrice === 'number') {
      const dateStr = format(new Date(order.orderDate), 'yyyy-MM-dd');
      dailySalesMap[dateStr] = (dailySalesMap[dateStr] || 0) + order.totalPrice;
    }
  });

  const totalSales = uniqueOrders.reduce((acc, order) => {
    return acc + (typeof order.totalPrice === 'number' ? order.totalPrice : 0);
  }, 0);

  const fifteenPercent = totalSales * 0.15;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="uppercase text-xl font-semibold mb-2">All Orders</h1>

      <div className="uppercase mb-4 text-xs font-semibold text-flag-blue">
        Total Sales:{' '}
        <strong className="text-green">
          ({formatCurrency(totalSales, uniqueOrders[0]?.currency || 'usd')})
        </strong>
        <br />
        15%:{' '}
        <strong className="text-flag-blue">
          ({formatCurrency(fifteenPercent, uniqueOrders[0]?.currency || 'usd')})
        </strong>
      </div>

      {uniqueOrders.length === 0 ? (
        <p className="text-center text-gray-600 uppercase tracking-wide font-light">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {uniqueOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
