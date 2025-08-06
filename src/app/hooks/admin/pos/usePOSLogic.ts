import { useState, useCallback, useEffect } from 'react';
import type { POSProduct, CartItem } from '@/types/admin/pos';
/* eslint-disable  @typescript-eslint/no-explicit-any */
const round2 = (n: number) => Math.round(n * 100) / 100;

interface UsePOSLogicProps {
  initialPaymentMethod?: 'cash' | 'card' | 'split';
}

export function usePOSLogic({
  initialPaymentMethod = 'card',
}: UsePOSLogicProps = {}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>(
    initialPaymentMethod
  );
  const [saleSuccess, setSaleSuccess] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [cashReceived, setCashReceived] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.cartQty, 0);
  const changeGiven =
    paymentMethod === 'cash' ? Math.max(cashReceived - total, 0) : 0;

  useEffect(() => {
    if (paymentMethod !== 'split') return;
    const remaining = total - cashReceived;
    setCardAmount(remaining > 0 ? round2(remaining) : 0);
  }, [paymentMethod, cashReceived, total]);

  const addToCart = useCallback((product: POSProduct) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item._id === product._id);
      if (index !== -1) {
        const updated = [...prevCart];
        const item = updated[index];
        if (item.cartQty < item.stock) {
          updated[index] = { ...item, cartQty: item.cartQty + 1 };
        }
        return updated;
      }
      return [...prevCart, { ...product, cartQty: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((index: number, qty: number) => {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, cartQty: qty } : item))
    );
  }, []);

  const removeItem = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSaleSuccess(null);
  }, []);

  const handleSale = useCallback(async () => {
    if (!cart.length) return;
    if (
      paymentMethod === 'split' &&
      Math.abs(cashReceived + cardAmount - total) > 0.01
    ) {
      alert('❌ Split payment does not add up to total.');
      return;
    }

    setLoading(true);

    const payload = cart.map((item) => ({
      productId: `${item._id}-${item.size}`, // important format
      quantity: item.cartQty,
      price: item.price,
    }));

    try {
      const res = await fetch('/api/admin/pos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json', // ✅ Ensures Android gets JSON only
        },
        body: JSON.stringify({
          items: payload,
          paymentMethod,
          cashReceived:
            paymentMethod !== 'card' ? round2(cashReceived) : undefined,
          cardAmount:
            paymentMethod !== 'cash'
              ? paymentMethod === 'split'
                ? round2(cardAmount)
                : round2(total)
              : undefined,
          changeGiven:
            paymentMethod === 'cash' ? round2(changeGiven) : undefined,
          customerName,
        }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch (jsonError) {
        const text = await res.text();
        console.error('❌ Could not parse JSON:', text);
        alert(
          `❌ Unexpected server response. Please try again or ask your dev.${jsonError}`
        );
        setLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        alert(`❌ Sale failed: ${data.message || 'Unknown error'}`);
      } else {
        clearCart();
        setSaleSuccess(data.orderNumber);

        setTimeout(() => {
          window.location.reload();
        }, 50000);
      }
    } catch (err: any) {
      console.error('❌ Network/server error:', err);
      alert(`❌ ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [
    cart,
    paymentMethod,
    cashReceived,
    cardAmount,
    total,
    changeGiven,
    customerName,
    clearCart,
  ]);

  return {
    cart,
    loading,
    paymentMethod,
    saleSuccess,
    customerName,
    cashReceived,
    cardAmount,
    showConfirmModal,
    totalItems,
    subtotal,
    tax,
    total,
    changeGiven,

    setCart,
    setLoading,
    setPaymentMethod,
    setSaleSuccess,
    setCustomerName,
    setCashReceived,
    setCardAmount,
    setShowConfirmModal,

    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    handleSale,
  };
}
