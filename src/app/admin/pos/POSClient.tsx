'use client';
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import { client } from '@/sanity/lib/client';

import ProductSearch from '@/components/admin/pos/ProductSearch';
import CartList from '@/components/admin/pos/CartList';
import SaleSummary from '@/components/admin/pos/SaleSummary';
import { usePOSLogic } from '@/app/hooks/admin/pos/usePOSLogic';
import SaleSuccessModal from '@/components/admin/pos/SaleSuccessModal';

export default function POSClient() {
  const {
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
  } = usePOSLogic();

  const [products, setProducts] = useState<any[]>([]);
  const [, setShowSummary] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Create a ref to the product list container for scrolling
  const productListRef = useRef<HTMLDivElement>(null);

  // 🧠 Scroll behavior (your existing code)
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const update = () => {
      const currentY = window.scrollY;

      if (!isInputFocused) {
        if (currentY > lastY + 10) {
          if (!hideTimeout) {
            hideTimeout = setTimeout(() => {
              setShowSummary(false);
              hideTimeout = null;
            }, 150);
          }
        } else if (currentY < lastY - 10) {
          if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
          }
          setShowSummary(true);
        }
      }

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [isInputFocused]);

  // 🛒 Fetch products once
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
            price: Number(variant.price ?? 0),
            stock: variant.stock,
            size: variant.size,
            imageUrl: product.imageUrl,
            category: product.category,
          }))
        );

        setProducts(flatProducts);
      });
  }, []);

  // Wrapped addToCart to scroll product list to top after adding
  function handleAddToCart(product: any) {
    addToCart(product);
    // Scroll filtered product list to top smoothly
    if (productListRef.current) {
      productListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden mx-auto bg-white max-w-xl">
      <ProductSearch
        products={products}
        onAddToCartAction={handleAddToCart}
        productListRef={productListRef} // pass the ref down here
      />
      <CartList
        cart={cart}
        updateQuantityAction={updateQuantity}
        removeItemAction={removeItem}
      />

      {cart.length > 0 && (
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
          round2Action={(n: number) => Math.round(n * 100) / 100}
          changeGiven={changeGiven}
          showConfirmModal={showConfirmModal}
          setShowConfirmModalAction={setShowConfirmModal}
          customerName={customerName}
          setCustomerNameAction={setCustomerName}
          loading={loading}
          handleSaleAction={handleSale}
          clearCartAction={clearCart}
          cartEmpty={cart.length === 0}
          onInputFocus={() => setIsInputFocused(true)}
          onInputBlur={() => setIsInputFocused(false)}
        />
      )}

      {saleSuccess && (
        <SaleSuccessModal
          orderNumber={saleSuccess}
          onClose={() => setSaleSuccess(null)}
        />
      )}
    </div>
  );
}
