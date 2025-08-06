'use client';

import React from 'react';
import type { SaleSummaryProps } from '@/types/admin/pos';

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
  showConfirmModal,
  setShowConfirmModalAction,
  customerName,
  setCustomerNameAction,
  loading,
  handleSaleAction,
  clearCartAction,
  cartEmpty,
  onInputFocus,
  onInputBlur,
}: SaleSummaryProps & {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}) {
  const isCashValid = cashReceived >= total;

  return (
    <div className="max-w-xl flex flex-col align-center py-2">
      <div className="flex justify-between uppercase text-xs font-semibold text-center text-black border-black border-b">
        <h3 className="mb-2">Sale Summary</h3>
        <p> Items: {totalItems}</p>
      </div>

      <div className="flex justify-between mt-2 text-sm uppercase font-light">
        <p className="text-xs">Subtotal:</p>
        <p>${subtotal.toFixed(2)}</p>
      </div>

      <div className="flex justify-between text-sm uppercase font-light">
        <p className="text-xs">Tax:</p>
        <p>${tax.toFixed(2)}</p>
      </div>

      <div className="flex justify-between text-sm uppercase font-light">
        <p className="text-xs">Total:</p>
        <p className="text-green font-bold">${total.toFixed(2)}</p>
      </div>

      {/* Payment Method */}
      <div className="text-xs text-black font-light">
        <div className="relative w-full">
          <select
            value={paymentMethod}
            onChange={(e) => {
              const method = e.target.value as 'cash' | 'card' | 'split';
              setPaymentMethodAction(method);
              if (method === 'cash') setCardAmountAction(0);
              if (method === 'card') setCashReceivedAction(0);
            }}
            className="appearance-none w-full p-1 bg-white text-black text-sm uppercase focus:outline-none focus:ring-0"
            onFocus={onInputFocus}
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
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              className="w-full p-2 text-black focus:outline-none focus:ring-0"
            />

            {/* Show "Not enough funds" message if cashReceived < total */}
            {cashReceived < total && cashReceived !== 0 && (
              <p className="text-xs text-red-500 pt-1 font-semibold">
                Not enough funds. Please provide more cash.
              </p>
            )}

            {/* Show "Change Due" if enough cash is received */}
            {cashReceived >= total && (
              <div className="text-xs flex justify-between  py-1">
                <p className="">Change Due: </p>
                <p className="font-bold text-sm">${changeGiven.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

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
                onFocus={onInputFocus}
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
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                className="w-full p-2 text-black focus:outline-none focus:ring-0"
              />
            </div>
            {Math.abs(cashReceived + cardAmount - total) > 0.01 && (
              <p className="text-xs py-1 text-yellow-300 font-semibold">
                Amount does not match total.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 -lg shadow-xl w-full max-w-md mx-auto text-center">
            <h2 className="text-md uppercase font-bold mb-3">Confirm Sale</h2>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerNameAction(e.target.value)}
              placeholder="Enter customer name"
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              className="w-full uppercase text-xs p-2 mb-4 border border-gray-300 text-black focus:outline-none focus:ring-0"
            />
            <p className="uppercase text-sm mb-4 text-gray-700">
              Are you sure you want to complete this sale for{' '}
              <span className="font-bold text-green">${total.toFixed(2)}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmModalAction(false)}
                className="uppercase text-sm px-3 py-1 bg-red-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowConfirmModalAction(false);
                  await handleSaleAction();
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

      {/* Final Action Buttons */}
      <div className="flex gap-5 w-full mt-4">
        <button
          onClick={clearCartAction}
          disabled={cartEmpty || loading}
          className={`w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm 
            ${
              cartEmpty || loading
                ? 'bg-red-300 cursor-not-allowed text-white'
                : 'bg-red-500  active:bg-red-700 text-white'
            }`}
        >
          Clear Sale
        </button>

        <button
          onClick={() => setShowConfirmModalAction(true)}
          disabled={
            loading || cartEmpty || (paymentMethod === 'cash' && !isCashValid)
          }
          className={`w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm 
            ${
              loading || cartEmpty || (paymentMethod === 'cash' && !isCashValid)
                ? 'bg-gray-500 cursor-not-allowed text-white'
                : 'bg-green  text-white active:scale-[0.98]'
            }`}
        >
          {loading ? `Processing... $${total.toFixed(2)}` : `Complete Sale`}
        </button>
      </div>
    </div>
  );
}
