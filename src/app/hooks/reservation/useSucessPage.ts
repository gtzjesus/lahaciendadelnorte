import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export function useSuccessPage(
  orderNumber: string | null,
  clearBasket: () => void
) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!orderNumber) return;

    // Clear basket, session/local storage, cookies
    clearBasket();
    sessionStorage.clear();
    localStorage.clear();

    document.cookie.split(';').forEach((cookie) => {
      const cookieName = cookie.trim().split('=')[0];
      if (
        cookieName.startsWith('cart_') ||
        cookieName === 'your-cart-cookie-name'
      ) {
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });

    // Confetti celebration
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orderNumber, clearBasket]);

  return { countdown };
}
