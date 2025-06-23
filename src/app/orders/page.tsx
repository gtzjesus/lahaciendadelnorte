import Header from '@/components/common/header';
import { getMyOrders } from '@/sanity/lib/orders/getMyOrders';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PickupLocation from '@/components/orders/PickupLocation';
import OrderCard from '@/components/orders/OrderCard';

export default async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const orders = await getMyOrders(userId);

  return (
    <>
      <Header />

      <div className="bg-flag-red flex flex-col items-center justify-center min-h-screen pt-10">
        <div className="p-4 w-full max-w-3xl">
          <div className="flex flex-col justify-between">
            <h1 className="text-md uppercase font-light text-white tracking-tight my-4">
              your firework reservations
            </h1>

            <PickupLocation />
          </div>

          {orders.length === 0 ? (
            <div className="text-sm text-center uppercase font-light text-gray-900 tracking-tight m-4">
              <p>you have not made any reservations yet.</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {orders.map((order) => (
                <OrderCard key={order.orderNumber} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
