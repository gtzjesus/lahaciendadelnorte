'use client';
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';

import ProductSearch from '@/components/admin/pos/ProductSearch';
import CartList from '@/components/admin/pos/CartList';
import SaleSummary from '@/components/admin/pos/SaleSummary';
import { usePOSLogic } from '@/app/hooks/admin/usePOSLogic';
import SaleSuccessModal from '../../../components/admin/pos/SaleSuccessModal';

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

  // Fetch products once
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
      />

      {saleSuccess && (
        <SaleSuccessModal
          orderNumber={saleSuccess}
          onClose={() => setSaleSuccess(null)} // optional if you want to clear modal on close instead of reload
        />
      )}
    </div>
  );
}
