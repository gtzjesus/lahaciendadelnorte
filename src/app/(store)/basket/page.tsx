'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

import Loader from '@/components/common/Loader';
import Header from '@/components/common/header';
import EmptyBasket from '@/components/basket/EmptyBasket';
import OrderSummary from '@/components/basket/OrderSummary';

import useBasketStore from '../../../../store/store';
import { useReservation } from '@/app/hooks/reservation/useReservation';
import BasketItemsList from '@/components/basket/BasketItemsList';

export default function BasketPage() {
  const { isSignedIn = false } = useAuth();
  const { user } = useUser();

  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const totalPrice = useBasketStore((state) => state.getTotalPrice());

  const [isClient, setIsClient] = useState(false);

  const { isLoading, reservationError, handleReservation } = useReservation();

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

  const handleRemoveItem = (productId: string) => {
    useBasketStore.getState().removeAllOfItem(productId);
    sessionStorage.removeItem(productId);
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
          <BasketItemsList
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
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
