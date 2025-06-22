'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

import useBasketStore from '../../../../store/store';
import Loader from '@/components/common/Loader';
import Header from '@/components/common/header';
import { createReservation } from '../../../../actions/createReservation';
import EmptyBasket from '@/components/basket/EmptyBasket';
import OrderSummary from '@/components/basket/OrderSummary';
import BasketItemCard from '@/components/basket/BasketItemCard';

export default function BasketPage() {
  const { isSignedIn = false } = useAuth();
  const { user } = useUser();
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const totalPrice = useBasketStore((state) => state.getTotalPrice());

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reservationError, setReservationError] = useState('');

  function generateOrderNumber(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  useEffect(() => {
    setIsClient(true);

    if (
      isSignedIn &&
      user?.id &&
      sessionStorage.getItem('checkoutAfterLogin') === 'true'
    ) {
      sessionStorage.removeItem('checkoutAfterLogin');
      handleReservation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user]);

  if (!isClient) return <Loader />;
  if (groupedItems.length === 0) return <EmptyBasket />;

  const handleReservation = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);
    setReservationError('');

    try {
      const metadata = {
        orderNumber: generateOrderNumber(),
        customerName:
          user?.fullName?.trim() ||
          user?.emailAddresses[0]?.emailAddress.split('@')[0] ||
          'Unknown',
        customerEmail: user?.emailAddresses[0].emailAddress ?? 'Unknown',
        clerkUserId: user!.id,
      };

      const result = await createReservation(groupedItems, metadata);

      if (result?.success) {
        window.location.href = `/success?order=${metadata.orderNumber}`;
        return;
      }
    } catch (err) {
      console.error('Reservation failed:', err);
      setReservationError(
        'Some items are no longer available. Please review your fireworks basket.'
      );
      await refreshStockLevels(); // Refetch stock after failure
    }

    setIsLoading(false);
  };

  const refreshStockLevels = async () => {
    const productIds = groupedItems.map((item) => item.product._id).join(',');
    try {
      const res = await fetch(`/api/stock?ids=${productIds}`);
      const latestStocksRecord: Record<string, number> = await res.json();

      // Convert record to array [{ _id, stock }]
      const latestStocksArray = Object.entries(latestStocksRecord).map(
        ([_id, stock]) => ({ _id, stock })
      );

      useBasketStore.getState().updateStockLevels(latestStocksArray);
    } catch (err) {
      console.error('Failed to fetch latest stock:', err);
    }
  };

  const handleRemoveItem = (productId: string) => {
    useBasketStore.getState().removeAllOfItem(productId); // 💥 removes entire item
    sessionStorage.removeItem(productId); // optional cleanup
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    useBasketStore.getState().updateItemQuantity(productId, quantity);
  };

  return (
    <div className="bg-red min-h-screen">
      <Header />

      <div className="w-full bg-flag-red">
        <h1 className="uppercase text-sm font-light text-center p-5 text-white">
          fireworks basket
        </h1>
      </div>

      {reservationError && (
        <div className="bg-red-100 text-red-700 text-center p-4 text-xs uppercase">
          {reservationError}
        </div>
      )}

      <div className="container mx-auto w-full px-2 lg:px-2 grid grid-cols-1">
        <div className="col-span-2 pb-80">
          {groupedItems.map((item) => (
            <BasketItemCard
              key={item.product._id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <OrderSummary
          totalItems={groupedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}
          totalPrice={totalPrice}
          isSignedIn={isSignedIn}
          isLoading={isLoading}
          onCheckout={handleReservation}
        />
      </div>
    </div>
  );
}
