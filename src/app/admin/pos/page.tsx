'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { Fireworks } from 'fireworks-js';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  stock?: number;
  itemNumber?: string;
  imageUrl?: string;
  description?: string;
};

type CartItem = Product & { cartQty: number };

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const manualInputRef = useRef<HTMLInputElement>(null);

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [manualError, setManualError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fireworksContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [finalTotal, setFinalTotal] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const totalItems = cart.reduce((sum, item) => sum + item.cartQty, 0);
  const subtotal = cart.reduce((sum, item) => {
    if ((item.stock ?? 0) <= 0) return sum;
    return sum + item.price * item.cartQty;
  }, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>(
    'card'
  );

  const [cashReceived, setCashReceived] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);

  const changeGiven =
    paymentMethod === 'cash' ? Math.max(cashReceived - total, 0) : 0;

  // Redondeo helper
  const round2 = (num: number) => Math.round(num * 100) / 100;

  useEffect(() => {
    if (showManualModal) {
      manualInputRef.current?.focus();
    }
  }, [showManualModal]);

  useEffect(() => {
    if (paymentMethod === 'split') {
      const remaining = total - cashReceived;
      const rounded = round2(remaining);
      setCardAmount(rounded > 0 ? rounded : 0);
    }
  }, [cashReceived, paymentMethod, total]);

  useEffect(() => {
    client
      .fetch<Product[]>(
        `*[_type == "product"]{
        _id,
        name,
        slug,
        itemNumber,
        price,
        stock,
        description,
        "imageUrl": image.asset->url
      }`
      )
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    return () => {
      html5QrCodeRef.current?.stop().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(term)
    );
    setSearchResults(filtered.slice(0, 5)); // limit results to 5
  }, [searchTerm, products]);

  const launchFireworks = () => {
    if (!fireworksContainer.current) return;
    fireworksContainer.current.innerHTML = '';
    fireworksContainer.current.style.opacity = '1';
    const fw = new Fireworks(fireworksContainer.current, {
      opacity: 0.8,
      acceleration: 1.2,
      friction: 0.95,
      gravity: 1.5,
      explosion: 6,
      particles: 80,
      traceLength: 4,
      traceSpeed: 7,
      flickering: 20,
      hue: { min: 0, max: 360 },
      brightness: { min: 50, max: 100 },
      delay: { min: 20, max: 50 },
      autoresize: true,
      sound: { enabled: false },
    });
    fw.start();
    return fw;
  };

  const startScanner = async () => {
    if (html5QrCodeRef.current) return;

    const scanner = new Html5Qrcode('reader');
    html5QrCodeRef.current = scanner;

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        const backCamera = cameras.find((cam) =>
          cam.label.toLowerCase().includes('back')
        );
        const cameraId = backCamera?.id || cameras[cameras.length - 1].id;

        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            const code = decodedText.trim().toLowerCase();
            const matched = products.find(
              (p) => p.slug.current.toLowerCase() === code
            );
            if (!matched) return;

            await scanner.stop();
            html5QrCodeRef.current = null;
            setIsScanning(false); // 🔑 Stop tracking
            setCart((prev) => [...prev, { ...matched, cartQty: 1 }]);

            setTimeout(() => {
              startScanner();
              setIsScanning(true); // 🔑 Resume tracking
            }, 1000);
          },
          (err) => console.warn('QR error:', err)
        );

        setIsScanning(true); // 🔑 Set scanning active
      }
    } catch (err) {
      console.error('Camera error', err);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop().catch(() => {});
      html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
      setIsScanning(false); // 🔑 Scanner is stopped
    }
  };

  const updateQuantity = (index: number, qty: number) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, cartQty: Math.min(Math.max(qty, 1), item.stock || 1) }
          : item
      )
    );
  };

  const removeItem = (i: number) =>
    setCart((prev) => prev.filter((_, idx) => idx !== i));
  const clearCart = () => setCart([]);

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

    const stockErrors = cart.filter((item) => {
      const inStock = item.stock ?? 0;
      return item.cartQty > inStock || inStock <= 0;
    });

    if (stockErrors.length) {
      setLoading(false);
      return;
    }

    try {
      const payload = cart.map((item) => ({
        productId: item._id,
        quantity: item.cartQty,
        price: item.price,
        finalPrice: item.price * item.cartQty,
      }));

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

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(`❌ Sale failed: ${data.message || 'Unknown error'}`);
      } else {
        setFinalTotal(total);
        clearCart();
        setShowCelebration(true);
        const fw = launchFireworks();
        celebrationTimeout.current = setTimeout(() => {
          fw?.stop();
          setShowCelebration(false);
          router.push('/admin/pos');
        }, 5000);
      }
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      alert(`❌ ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div
        ref={fireworksContainer}
        className="fixed inset-0 z-[2000] pointer-events-none"
        style={{ opacity: '0', transition: 'opacity 0.5s' }}
      />

      {showCelebration && (
        <div className="fixed inset-0 z-[210] flex flex-col items-center justify-center bg-flag-blue bg-opacity-90 text-white p-6 text-center">
          <h1 className="text-5xl text-yellow font-extrabold mb-4 animate-bounce">
            Sale Success!
          </h1>
          {finalTotal !== null && (
            <p className="text-2xl text-yellow font-extrabold mb-4 animate-bounce">
              Total: ${finalTotal.toFixed(2)}
            </p>
          )}
          <button
            onClick={() => {
              setShowCelebration(false);
              router.push('/admin/orders');
            }}
            className="bg-white text-flag-blue uppercase px-6 py-3 font-light"
          >
            View Orders
          </button>
        </div>
      )}

      <div className="p-3">
        <h1 className="text-2xl uppercase font-bold mb-4">Point of Sale</h1>
        {isScanning ? (
          <button
            onClick={stopScanner}
            className="p-4 mb-2 block uppercase text-md font-light text-center bg-flag-red text-white w-full"
          >
            Stop Scanning
          </button>
        ) : (
          <button
            onClick={startScanner}
            className="p-4 mb-2 block uppercase text-md font-light text-center bg-flag-blue text-white w-full"
          >
            Start Scanning
          </button>
        )}

        <button
          onClick={() => {
            setManualInput('');
            setManualError('');
            setShowManualModal(true);
          }}
          className="p-4 mb-4 block uppercase text-md font-light text-center bg-flag-red text-white w-full"
        >
          Enter firework Manually
        </button>

        <div className="">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search firework"
            className="uppercase text-md w-full p-4 border border-flag-blue text-flag-blue mb-1"
          />
          {searchResults.length > 0 && (
            <ul className="border border-gray-300 py-4  rounded max-h-40 overflow-y-auto bg-white shadow-md">
              {searchResults.map((product) => (
                <li
                  key={product._id}
                  onClick={() => {
                    setCart((prev) => [...prev, { ...product, cartQty: 1 }]);
                    setSearchTerm('');
                    setSearchResults([]);
                    const fw = launchFireworks();
                    setTimeout(() => fw?.stop(), 2000);
                  }}
                  className="border-b mx-2 cursor-pointer flex items-center gap-3 px-2 py-4 hover:bg-flag-blue hover:text-white"
                >
                  {product.imageUrl && (
                    <div className="relative w-9 h-9 flex-shrink-0 overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="32px"
                      />
                    </div>
                  )}
                  <span className="uppercase">{product.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div id="reader" className="w-full max-w-md mx-auto" />

        {showManualModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto text-center">
              <h2 className="text-md font-bold mb-4 uppercase">
                Enter firework Number
              </h2>
              <input
                ref={manualInputRef}
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />

              {manualError && (
                <p className="text-red-500 text-md mb-2">{manualError}</p>
              )}
              <div className=" flex justify-center space-x-4">
                <button
                  onClick={() => setShowManualModal(false)}
                  className="uppercase text-md px-3 py-1 bg-flag-red text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const code = manualInput.trim().toLowerCase();
                    const matched = products.find(
                      (p) => (p.itemNumber ?? '').toLowerCase() === code
                    );

                    if (!matched) {
                      setManualError(
                        '❌ No firework found with that item number.'
                      );
                      return;
                    }

                    setCart((prev) => [...prev, { ...matched, cartQty: 1 }]);
                    setShowManualModal(false);
                  }}
                  className="uppercase text-md px-3 py-1 bg-flag-blue text-white"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {cart.map((item, i) => {
            const lineTotal = item.price * item.cartQty;
            return (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-2"
              >
                <div className="flex items-center">
                  {item.imageUrl && (
                    <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="uppercase">
                    <div className="font-light">
                      {item.name}
                      <div className="text-md text-gray-500">
                        Item #:{' '}
                        <span className="font-bold">
                          {item.itemNumber || 'N/A'}
                        </span>{' '}
                        | Stock:{' '}
                        <span className="font-bold">{item.stock ?? 0}</span>
                        {item.description && (
                          <div className="text-md text-gray-600 mt-1 normal-case">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="font-bold">
                      ${item.price.toFixed(2)} x
                      {(item.stock ?? 0) > 0 ? (
                        <select
                          className="ml-2 border px-1 py-0.5"
                          value={item.cartQty}
                          onChange={(e) =>
                            updateQuantity(i, Number(e.target.value))
                          }
                        >
                          {[...Array(item.stock)].map((_, n) => (
                            <option key={n + 1} value={n + 1}>
                              {n + 1}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="ml-2 text-md text-red-600 font-semibold">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-green">
                  <div className="font-semibold">
                    ${(item.stock ?? 0) > 0 ? lineTotal.toFixed(2) : '--'}
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    className="text-flag-red mt-1"
                  >
                    ❌
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
          <label className="block uppercase text-md ">Payment Method</label>
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
              <label className="text-md">Cash Received</label>
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

              <p className="text-md mt-1">
                Change Due:{' '}
                <span className="font-bold">${changeGiven.toFixed(2)}</span>
              </p>
            </div>
          )}

          {paymentMethod === 'split' && (
            <div className=" space-y-2">
              <div>
                <label className="text-md">Cash Portion</label>
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
                <label className="text-md">Card Portion</label>
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
                <p className="text-md text-yellow-300 font-semibold">
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
              <p className="uppercase text-md mb-4 text-gray-700">
                Are you sure you want to complete this sale for{' '}
                <span className="font-bold text-green">
                  ${total.toFixed(2)}
                </span>
                ?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="uppercase text-md px-3 py-1 bg-flag-red text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowConfirmModal(false);
                    await handleSale();
                  }}
                  className="uppercase text-md px-3 py-1 bg-flag-blue text-white"
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
    </div>
  );
}
