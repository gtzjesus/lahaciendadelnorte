'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>(
    'card'
  );
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    if (searchTerm.trim() === '') return setFilteredResults([]);
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(results);
  }, [searchTerm, products]);

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

    setSearchTerm('');
    setFilteredResults([]);
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
        alert('❌ Server did not return valid JSON.');
        return;
      }

      if (!res.ok || !data.success) {
        alert(`❌ Sale failed: ${data.message || 'Unknown error'}`);
      } else {
        alert(`✅ Sale complete! Order #: ${data.orderNumber}`);
        clearCart();
        router.push('/admin/orders');
      }
    } catch (err: any) {
      alert(`❌ ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden mx-auto bg-white min-h-screen">
      <h1 className="text-2xl font-bold uppercase m-4">Point of sale</h1>

      <div className="px-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 border border-flag-red uppercase text-sm "
        />
      </div>

      {filteredResults.length > 0 && (
        <div className="uppercase text-md border rounded shadow-md bg-white max-h-60 overflow-y-auto mb-4 ">
          {filteredResults.map((product) => (
            <div
              key={product._id}
              onClick={() => addToCart(product)}
              className="cursor-pointer flex items-center space-x-3 p-2 border-b hover:bg-gray-100 transition"
            >
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="object-cover rounded w-12 h-12"
                />
              )}
              <div className="flex text-sm">
                <div className="px-2  font-semibold italic">{product.name}</div>
                <div className="">{product.category} </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 ">
        {cart.map((item, i) => (
          <div
            key={item._id}
            className="flex flex-col items-center border-b border-flag-red py-4 "
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={56}
                height={56}
                className="object-cover  w-16 h-16"
              />
            )}
            <div className="my-2 uppercase flex text-sm">
              <div className="">{item.name}</div>
              <div className="">{item.category} </div>
            </div>
            <div className="uppercase text-sm">
              <div className="px-2 text-flag-blue">stock: {item.stock}</div>$
              {item.price.toFixed(2)} x{' '}
              <select
                value={item.cartQty}
                onChange={(e) => updateQuantity(i, Number(e.target.value))}
                className="border my-2"
              >
                {Array.from({ length: item.stock }, (_, n) => (
                  <option key={n + 1} value={n + 1}>
                    {n + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-green ">
              ${(item.price * item.cartQty).toFixed(2)}
              <button
                className="text-red-500 text-sm px-4"
                onClick={() => removeItem(i)}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full lg:w-auto bg-flag-blue p-6 lg:p-12 shadow-md mt-6">
        <h3 className="uppercase text-md font-light text-center text-white border-b pb-1">
          Sale Summary
        </h3>
        <div className="space-y-1 mt-2 mb-2 text-white uppercase text-md font-light">
          <p>Total Items: {totalItems}</p>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>

        {/* Payment Method Section */}
        <div className="mt-4 mb-4 text-white">
          <label className="block uppercase text-sm ">Payment Method</label>
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
            className="w-full p-2 text-black"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="split">Split</option>
          </select>

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
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto text-center">
              <h2 className="text-md uppercase font-bold mb-3">Confirm Sale</h2>
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
                  className="uppercase text-sm px-3 py-1 bg-flag-red text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowConfirmModal(false);
                    await handleSale();
                  }}
                  className="uppercase text-sm px-3 py-1 bg-flag-blue text-white"
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
          className="p-4 mb-2 block uppercase text-md font-light text-center bg-green text-white w-full"
        >
          {loading
            ? `Processing... $${total.toFixed(2)}`
            : `Complete Sale ($${total.toFixed(2)})`}
        </button>

        <button
          onClick={clearCart}
          disabled={cart.length === 0 || loading}
          className="p-4 mb-2 block uppercase text-md font-light text-center bg-flag-red text-white w-full"
        >
          Clear Sale
        </button>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Confirm Sale</h2>
            <p>Total: ${total.toFixed(2)}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSale();
                }}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
