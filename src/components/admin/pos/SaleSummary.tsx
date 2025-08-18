'use client';
import React, { useState, useEffect } from 'react';
import type { SaleSummaryProps } from '@/types/admin/pos';
import CustomerNameModal from './CustomerNameModal';
import LoaderOrder from '../common/LoaderOrder';

export default function SaleSummary({
  totalItems,
  subtotal,
  tax,
  total,
  paymentMethod,
  setPaymentMethodAction,
  cashReceived,
  setCashReceivedAction,
  cardAmount,
  setCardAmountAction,
  round2Action,
  changeGiven,
  customerName,
  setCustomerNameAction,
  loading,
  handleSaleAction,
  clearCartAction,
  cartEmpty,
  onInputFocus,
  onInputBlur,
  postSaleDelay,
}: SaleSummaryProps & {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  postSaleDelay: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isCashValid = cashReceived >= total;

  const handleModalSubmit = async () => {
    setIsModalOpen(false);
    await handleSaleAction();
  };

  // 🔒 Prevent body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  if (postSaleDelay) return null;

  return (
    <div
      className={`
    fixed bottom-0  left-0 right-0 z-30 w-full max-w-xl md:max-w-4xl mx-auto
    transition-all duration-700 ease-in-out
    ${isExpanded ? 'h-[80dvh]' : 'h-[50px]'}
    rounded-t-xl shadow-xl overflow-hidden bg-cover bg-center bg-no-repeat
  `}
      style={{ backgroundImage: "url('/admin/summary.webp')" }}
      onClick={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
    >
      {/* ⏳ Fullscreen Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-flag-red bg-opacity-80 flex justify-center items-center">
          <LoaderOrder />
        </div>
      )}

      {/* ⬇️ Drag Handle */}
      {!isExpanded && (
        <div className="w-10 h-1 bg-white bg-opacity-60 rounded-full mx-auto my-2" />
      )}

      {/* ❌ Collapse Button */}
      {isExpanded && (
        <div className="flex justify-center mt-2 mb-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="text-white bg-black bg-opacity-20 px-3 py-1 rounded-full text-xs font-bold uppercase mb-5"
          >
            hide summary ↓
          </button>
        </div>
      )}
      {!isExpanded && (
        <div className="flex justify-between  text-xs font-bold text-center text-black border-red-300 border-b px-4">
          <h3 className="mb-2">Summary</h3>
          <p className="text-green font-bolightld pr-3">${total.toFixed(2)}</p>
          <p> Items {totalItems}</p>
        </div>
      )}

      {/* 💸 Summary Info */}
      <div className="px-4 font-bold">
        <div className="flex justify-between mt-2 text-md uppercase ">
          <p>Subtotal:</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-md uppercase ">
          <p>Tax:</p>
          <p>${tax.toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-md uppercase ">
          <p>Total:</p>
          <p className="text-green font-bold">${total.toFixed(2)}</p>
        </div>

        {/* 🏦 Payment Method */}
        <div className="text-sm text-black  mt-4">
          <p className="text-xs mb-1 ">Please select the payment method.</p>
          <div className="relative w-full">
            <select
              value={paymentMethod}
              onChange={(e) => {
                const method = e.target.value as 'cash' | 'card' | 'split';
                setPaymentMethodAction(method);
                if (method === 'cash') setCardAmountAction(0);
                if (method === 'card') setCashReceivedAction(0);
              }}
              className="appearance-none w-full p-1 bg-white text-black text-md uppercase focus:outline-none focus:ring-0"
              onFocus={() => {
                setIsExpanded(true);
                onInputFocus?.();
              }}
              onBlur={onInputBlur}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="split">Split</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black text-xs">
              ▼
            </div>
          </div>

          {/* 💵 Cash Fields */}
          {paymentMethod === 'cash' && (
            <div className="uppercase">
              <p className="text-xs py-1">Cash Received</p>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cashReceived === 0 ? '' : cashReceived}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCashReceivedAction(isNaN(val) ? 0 : round2Action(val));
                }}
                onFocus={() => {
                  setIsExpanded(true);
                  onInputFocus?.();
                }}
                onBlur={onInputBlur}
                className="w-full p-2 text-black focus:outline-none focus:ring-0"
              />
              {cashReceived < total && cashReceived !== 0 && (
                <p className="text-xs text-red-500 pt-1 font-bold">
                  Not enough funds. Please provide more cash.
                </p>
              )}
              {cashReceived >= total && (
                <div className="text-xs flex justify-between py-1">
                  <p className="">Change Due: </p>
                  <p className="font-bold text-md">${changeGiven.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* 💳 Split Payment */}
          {paymentMethod === 'split' && (
            <div className="uppercase">
              <div>
                <p className="text-xs py-1">Cash Portion</p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashReceived === 0 ? '' : cashReceived}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCashReceivedAction(isNaN(val) ? 0 : round2Action(val));
                  }}
                  onFocus={() => {
                    setIsExpanded(true);
                    onInputFocus?.();
                  }}
                  onBlur={onInputBlur}
                  className="w-full p-2 text-black focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                <p className="text-xs py-1">Card Portion</p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cardAmount === 0 ? '' : cardAmount}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCardAmountAction(isNaN(val) ? 0 : round2Action(val));
                  }}
                  onFocus={() => {
                    setIsExpanded(true);
                    onInputFocus?.();
                  }}
                  onBlur={onInputBlur}
                  className="w-full p-2 text-black focus:outline-none focus:ring-0"
                />
              </div>
              {Math.abs(cashReceived + cardAmount - total) > 0.01 && (
                <p className="text-xs py-1 text-yellow-300 font-bold">
                  Amount does not match total.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 🧾 Buttons */}
        <div className="flex gap-5 w-full mt-4">
          <button
            onClick={clearCartAction}
            disabled={cartEmpty || loading}
            className={`w-full py-2 rounded-full text-xs font-bold uppercase transition duration-200 ease-in-out shadow-sm 
              ${
                cartEmpty || loading
                  ? 'bg-red-300 cursor-not-allowed text-white'
                  : 'bg-red-500 active:bg-red-700 text-white'
              }`}
          >
            Clear Sale
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            disabled={
              loading || cartEmpty || (paymentMethod === 'cash' && !isCashValid)
            }
            className={`w-full py-2 rounded-full text-xs font-bold uppercase transition duration-200 ease-in-out shadow-sm 
              ${
                loading ||
                cartEmpty ||
                (paymentMethod === 'cash' && !isCashValid)
                  ? 'bg-gray-500 cursor-not-allowed text-white'
                  : 'bg-green text-white active:scale-[0.98]'
              }`}
          >
            {loading ? `Processing... $${total.toFixed(2)}` : `Complete Sale`}
          </button>
        </div>
      </div>

      {/* 🧍 Customer Modal */}
      {isModalOpen && (
        <CustomerNameModal
          customerName={customerName}
          setCustomerNameAction={setCustomerNameAction}
          handleSubmit={handleModalSubmit}
          onClose={() => setIsModalOpen(false)}
          total={total}
          onInputFocus={onInputFocus}
          onInputBlur={onInputBlur}
        />
      )}
    </div>
  );
}
