'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import ProductSearch from '@/components/admin/pos/ProductSearch';
import CartList from '@/components/admin/pos/CartList';

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
      <div className="w-full lg:w-auto bg-flag-red p-6 lg:p-12 shadow-md mt-6">
        <h3 className="uppercase text-lg font-bold text-center text-black border-b pb-1">
          Sale Summary
        </h3>
        <div className="space-y-1 mt-2 mb-2 text-black uppercase text-md font-bold">
          <p>Total Items: {totalItems}</p>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>
            Total: <strong className="text-green">${total.toFixed(2)}</strong>
          </p>
        </div>

        {/* Payment Method Section */}
        <div className="mt-4 mb-4 text-black font-bold">
          <label className="block uppercase text-sm ">Payment Method</label>
          <div className="relative w-full mt-2">
            <select
              value={paymentMethod}
              onChange={(e) => {
                const method = e.target.value as 'cash' | 'card' | 'split';
                setPaymentMethod(method);
                if (method === 'cash') {
                  setCardAmount(0);
                } else if (method === 'card') {
                  setCashReceived(0);
                }
              }}
              className="appearance-none w-full p-2 pr-8 border border-black bg-white text-black  text-sm uppercase focus:outline-none"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="split">Split</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black text-xs">
              ▼
            </div>
          </div>

          {paymentMethod === 'cash' && (
            <div className="mt-2">
              <label className="text-sm">Cash Received</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cashReceived === 0 ? '' : cashReceived}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCashReceived(isNaN(val) ? 0 : round2(val));
                }}
                className="w-full p-2 mt-1 text-black"
              />

              <p className="text-sm mt-1">
                Change Due:{' '}
                <span className="font-bold">${changeGiven.toFixed(2)}</span>
              </p>
            </div>
          )}

          {paymentMethod === 'split' && (
            <div className=" space-y-2">
              <div>
                <label className="text-sm">Cash Portion</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashReceived === 0 ? '' : cashReceived}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCashReceived(isNaN(val) ? 0 : round2(val));
                  }}
                  className="w-full p-2 mt-1 text-black"
                />
              </div>
              <div>
                <label className="text-sm">Card Portion</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cardAmount === 0 ? '' : cardAmount}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCardAmount(isNaN(val) ? 0 : round2(val));
                  }}
                  className="w-full p-2 text-black"
                />
              </div>
              {Math.abs(cashReceived + cardAmount - total) > 0.01 && (
                <p className="text-sm text-yellow-300 font-semibold">
                  Amount does not match total.
                </p>
              )}
            </div>
          )}
        </div>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white p-6 -lg shadow-xl w-full max-w-md mx-auto text-center">
              <h2 className="text-md uppercase font-bold mb-3">Confirm Sale</h2>

              <label className="block mb-2 text-left uppercase text-sm font-semibold text-gray-700"></label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full uppercase text-xs p-2 mb-4 border border-gray-300  text-black"
              />

              <p className="uppercase text-sm mb-4 text-gray-700">
                Are you sure you want to complete this sale for{' '}
                <span className="font-bold text-green">
                  ${total.toFixed(2)}
                </span>
                ?
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="uppercase text-sm px-3 py-1 bg-red-500 text-white "
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowConfirmModal(false);
                    await handleSale();
                  }}
                  disabled={!customerName.trim()}
                  className={`uppercase text-sm px-3 py-1 text-black ${
                    customerName.trim()
                      ? 'bg-yellow cursor-pointer'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Yes, Complete Sale
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={loading || cart.length === 0}
          className={`p-4 mb-2 block uppercase text-md font-bold text-center text-black w-full ${
            loading
              ? 'bg-yellow cursor-wait'
              : 'bg-green text-yellow hover:bg-green-700 cursor-pointer'
          }`}
        >
          {loading
            ? `Processing... $${total.toFixed(2)}`
            : `Complete Sale ($${total.toFixed(2)})`}
        </button>

        <button
          onClick={clearCart}
          disabled={cart.length === 0 || loading}
          className="p-4 mb-2 block uppercase text-md font-bold text-center bg-red-500 text-white w-full"
        >
          Clear Sale
        </button>
      </div>
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
