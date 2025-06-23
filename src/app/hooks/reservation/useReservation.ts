import { useState } from 'react';
import { createReservation } from '../../../../actions/createReservation';
import useBasketStore from '../../../../store/store';
import { useAuth, useUser } from '@clerk/nextjs';

function generateOrderNumber(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export function useReservation() {
  const { isSignedIn = false } = useAuth();
  const { user } = useUser();
  const groupedItems = useBasketStore((state) => state.getGroupedItems());

  const [isLoading, setIsLoading] = useState(false);
  const [reservationError, setReservationError] = useState('');

  async function handleReservation() {
    if (!isSignedIn) return;
    setIsLoading(true);
    setReservationError('');

    try {
      const res = await fetch(
        `/api/stock?ids=${groupedItems.map((i) => i.product._id).join(',')}`
      );
      const latest: Record<string, number> = await res.json();

      for (const item of groupedItems) {
        const available = latest[item.product._id] ?? 0;
        if (available < item.quantity) {
          setReservationError(
            `${available} fireworks left for ${item.product.name}. Try again later for stock update.`
          );
          setIsLoading(false);
          return;
        }
      }

      const customerEmail =
        user?.emailAddresses?.[0]?.emailAddress || 'no-reply@example.com';

      const metadata = {
        orderNumber: generateOrderNumber(),
        customerName: customerEmail, // <-- Using email as name
        customerEmail,
        clerkUserId: user?.id ?? '',
        status: 'unpaid', // <-- added status for unpaid orders
      };

      const result = await createReservation(groupedItems, metadata);
      if (result?.success) {
        window.location.href = `/success?order=${metadata.orderNumber}&name=${encodeURIComponent(metadata.customerName)}&email=${encodeURIComponent(metadata.customerEmail)}`;
      }
    } catch (err) {
      setReservationError(
        err instanceof Error
          ? `Reservation failed: ${err.message}`
          : `Reservation failed: ${JSON.stringify(err)}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, reservationError, handleReservation };
}
