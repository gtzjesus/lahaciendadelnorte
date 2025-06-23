// app/(store)/orders/page.tsx

import Header from '@/components/common/header';
import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';
import { getMyOrders } from '@/sanity/lib/orders/getMyOrders';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
            {/* Store Pickup Location */}
            <div className="bg-white rounded-md shadow-md p-4 my-4 border border-flag-blue">
              <h2 className="text-sm  uppercase text-flag-blue mb-2">
                El paso kaboom
              </h2>

              {/* Google Maps Embed */}
              <div className="w-full h-64  overflow-hidden ">
                <iframe
                  title="Pickup Location"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  className="border-0"
                  src="https://www.google.com/maps?q=531+Talbot+Ave,+Canutillo,+TX+79835&output=embed"
                />
              </div>

              {/* Get Directions Button */}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=531+Talbot+Ave,+Canutillo,+TX+79835"
                target="_blank"
                rel="noopener noreferrer"
                className="my-4 uppercase text-sm block w-full text-center bg-flag-blue text-white font-semibold py-2 transition"
              >
                Get Directions
              </a>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-sm text-center uppercase font-light text-gray-900 tracking-tight m-4">
              <p>you have not made any reservations yet.</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="bg-white border border-flag-blue p-2 shadow-sm overflow-hidden"
                >
                  {/* Reservation Header */}
                  <div className="p-4 border-b border-white">
                    <div className="flex flex-row justify-between">
                      <div>
                        <p className="text-xs uppercase font-light font-mono">
                          reservation number
                        </p>
                        <span
                          className="font-mono uppercase font-light text-xs text-green-600 dark:text-green-400"
                          title={order.orderNumber || ''}
                        >
                          {order.orderNumber?.slice(-6)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-light font-mono text-gray-600">
                          reserved on
                        </p>
                        <p className="font-light text-xs mt-1">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : 'n/a'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reserved Items */}
                  <div className="font-mono p-4">
                    <p className="text-xs uppercase font-light text-gray-600">
                      items
                    </p>
                    <div>
                      {order.products?.map((product) => {
                        const prod = product.product;
                        const slug = prod?.slug?.current;

                        return (
                          <div
                            key={prod?._id}
                            className="flex flex-col border-b border-flag-blue last:border-b-0"
                          >
                            <div className="flex items-center gap-6">
                              {prod?.image && slug && (
                                <Link
                                  href={`/product/${slug}`}
                                  className="relative h-20 w-20 flex-shrink-0 mt-2 mb-2"
                                  aria-label={`View ${prod.name}`}
                                >
                                  <Image
                                    src={imageUrl(prod.image).url()}
                                    alt={prod.name ?? ''}
                                    className="object-cover"
                                    fill
                                    priority
                                  />
                                </Link>
                              )}

                              <div>
                                {slug ? (
                                  <Link
                                    href={`/product/${slug}`}
                                    className="font-xs uppercase text-gray-600 font-light mb-1 mt-2 hover:underline"
                                  >
                                    {prod?.name}
                                  </Link>
                                ) : (
                                  <p className="font-xs uppercase text-gray-600 font-light mb-1 mt-2">
                                    {prod?.name}
                                  </p>
                                )}
                                <p className="text-xs uppercase font-light text-gray-600">
                                  quantity: {product.quantity ?? 'n/a'}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-green-800 mb-1 text-xs text-right">
                                {prod?.price && product.quantity
                                  ? formatCurrency(
                                      prod.price * product.quantity,
                                      order.currency
                                    )
                                  : 'n/a'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Total */}
                  <div className="border-t border-flag-blue font-mono p-4 flex flex-col">
                    <div className="flex justify-between">
                      <p className="uppercase text-xs mb-1 text-gray-600">
                        estimated total (tax/fees at pickup):
                      </p>
                      <p className="font-bold text-xs">
                        ${order.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
