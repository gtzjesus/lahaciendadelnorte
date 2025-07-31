'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import ProductSearch from '@/components/admin/pos/ProductSearch';
import CartList from '@/components/admin/pos/CartList';
import SaleSummary from '@/components/admin/pos/SaleSummary';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type Product = {
  _id: string;
  baseName: string;
  name: string;
  slug: { current: string };
  price: number;
  stock: number;
  itemNumber?: string;
  imageUrl?: string;
  size: string;
  category?: string;
};

type CartItem = Product & { cartQty: number };

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>(
    'card'
  );
  const [saleSuccess, setSaleSuccess] = useState<null | string>(null);
  const [customerName, setCustomerName] = useState('');

  const [cashReceived, setCashReceived] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.cartQty, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQty,
    0
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const changeGiven =
    paymentMethod === 'cash' ? Math.max(cashReceived - total, 0) : 0;

  const router = useRouter();

  useEffect(() => {
    if (paymentMethod === 'split') {
      const remaining = total - cashReceived;
      setCardAmount(remaining > 0 ? round2(remaining) : 0);
    }
  }, [cashReceived, paymentMethod, total]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "product"]{
        _id, name, slug, itemNumber, image, 
        "imageUrl": image.asset->url,
        "category": category->title,
        variants[]{ size, price, stock }
      }`
      )
      .then((data) => {
        const flatProducts = data.flatMap((product: any) =>
          product.variants.map((variant: any) => ({
            _id: product._id + '-' + variant.size,
            baseName: product.name,
            name: `${product.name} - ${variant.size}`,
            slug: product.slug,
            itemNumber: product.itemNumber,
            price: variant.price,
            stock: variant.stock,
            size: variant.size,
            imageUrl: product.imageUrl,
            category: product.category,
          }))
        );
        setProducts(flatProducts);
      });
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingIndex];

        // Prevent exceeding stock
        if (existingItem.cartQty < existingItem.stock) {
          updatedCart[existingIndex] = {
            ...existingItem,
            cartQty: existingItem.cartQty + 1,
          };
        }

        return updatedCart;
      }

      return [...prevCart, { ...product, cartQty: 1 }];
    });
  };

  const updateQuantity = (i: number, qty: number) => {
    setCart((prev) =>
      prev.map((item, idx) => (i === idx ? { ...item, cartQty: qty } : item))
    );
  };

  const clearCart = () => setCart([]);
  const removeItem = (i: number) =>
    setCart((prev) => prev.filter((_, idx) => idx !== i));

  const handleSale = async () => {
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
      productId: item._id, // ✅ Already in correct format
      quantity: item.cartQty,
      price: item.price,
      finalPrice: item.price * item.cartQty,
      variantSize: item.size,
    }));

    try {
      const res = await fetch('/api/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      // Read response as raw text for debugging
      const raw = await res.text();
      console.log('🔍 Raw response from /api/pos:', raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON:', jsonError);
        alert(
          '❌ Server did not return valid JSON. Please try again to complete sale.'
        );
        return;
      }

      if (!res.ok || !data.success) {
        alert(`❌ Sale failed: ${data.message || 'Unknown error'}`);
      } else {
        clearCart();
        setSaleSuccess(data.orderNumber); // 💡 Show full-screen overlay

        setTimeout(() => {
          window.location.reload();
        }, 5000); // Reload after 5 seconds
      }
    } catch (err: any) {
      alert(`❌ ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden mx-auto bg-white min-h-screen max-w-2xl">
      <h1 className="text-2xl font-bold uppercase m-4">Point of sale</h1>

      <ProductSearch products={products} onAddToCartAction={addToCart} />
      <CartList
        cart={cart}
        updateQuantityAction={updateQuantity}
        removeItemAction={removeItem}
      />
      <SaleSummary
        totalItems={totalItems}
        subtotal={subtotal}
        tax={tax}
        total={total}
        paymentMethod={paymentMethod}
        setPaymentMethodAction={setPaymentMethod}
        cashReceived={cashReceived}
        setCashReceivedAction={setCashReceived}
        cardAmount={cardAmount}
        setCardAmountAction={setCardAmount}
        round2Action={round2}
        changeGiven={changeGiven}
        showConfirmModal={showConfirmModal}
        setShowConfirmModalAction={setShowConfirmModal}
        customerName={customerName}
        setCustomerNameAction={setCustomerName}
        loading={loading}
        handleSaleAction={handleSale}
        clearCartAction={clearCart}
        cartEmpty={cart.length === 0}
      />

      {saleSuccess && (
        <div className="fixed inset-0  flex flex-col items-center justify-center bg-flag-red  text-black animate-fadeIn space-y-6 p-6">
          <h2 className="text-3xl font-bold text-green uppercase">
            Sale Success!
          </h2>
          <p className="text-lg uppercase">Order #{saleSuccess}</p>
          <button
            onClick={async () => {
              await router.push('/admin/orders');
            }}
            className="px-6 py-3 bg-black text-white font-bold  hover:bg-yellow-300 transition uppercase text-sm"
          >
            View order
          </button>
        </div>
      )}
    </div>
  );
}
