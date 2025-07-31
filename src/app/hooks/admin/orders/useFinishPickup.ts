import { useState } from 'react';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function useFinishPickup(
  initialStatus: string | undefined,
  orderId: string | undefined
) {
  const [pickupStatus, setPickupStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finishPickup() {
    if (!orderId) {
      setError('Order ID missing');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders/finish-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to finish pickup');
      }

      setPickupStatus('completed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { pickupStatus, finishPickup, isLoading, error, setError };
}
