'use client';

import { useEffect } from 'react';

export default function BuggyComponent() {
  useEffect(() => {
    const testOrder = async () => {
      try {
        const res = await fetch('/api/admin/pos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            // ❌ INVALID payload to trigger backend error
            items: [
              {
                productId: 'invalid-product-no-size', // will fail split
                quantity: 'not-a-number', // invalid
                price: 12.99,
              },
            ],
            paymentMethod: 'card',
          }),
        });

        let result;

        try {
          result = await res.json();
        } catch (jsonError) {
          const fallbackText = await res.text();
          console.error(
            `❌ Failed to parse JSON. Response text: ${jsonError}`,
            fallbackText
          );
          return;
        }

        if (!res.ok) {
          console.error('❌ Server responded with error:', result);
        } else {
          console.log('✅ Server responded OK:', result);
        }
      } catch (err) {
        console.error('❌ Network or unexpected error:', err);
      }
    };

    testOrder();
  }, []);

  return (
    <div className="p-4 border rounded bg-red-50 text-red-800">
      ⚠️ Test order being submitted... Check console for results.
    </div>
  );
}
