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
}: SaleSummaryProps) {
  return (
    <div className="p-4 ">
      <div className="flex justify-between uppercase text-sm font-semibold text-center text-black border-black border-b ">
        <h3 className="mb-2">Sale Summary</h3>
        <p> Items: {totalItems}</p>
      </div>
      <div className="flex justify-between mt-2  text-sm uppercase font-light space-y-1">
        <p>
          <span>Subtotal:</span>{' '}
        </p>
        <p>
          <span> ${subtotal.toFixed(2)}</span>
        </p>
      </div>

      <div className="flex justify-between mt-2  text-sm uppercase font-light space-y-1">
        <p>
          <span>tax:</span>{' '}
        </p>
        <p>
          <span> ${tax.toFixed(2)}</span>
        </p>
      </div>

      <div className="flex justify-between mt-2  text-sm uppercase font-light space-y-1">
        <p>
          <span>total:</span>{' '}
        </p>
        <p>
          <span className="text-green"> ${total.toFixed(2)}</span>
        </p>
      </div>

      {/* Payment Method */}
      <div className="mt-2 mb-2 text-black font-semibold">
        <div className="relative w-full">
          <select
            value={paymentMethod}
            onChange={(e) => {
              const method = e.target.value as 'cash' | 'card' | 'split';
              setPaymentMethodAction(method);
              if (method === 'cash') setCardAmountAction(0);
              if (method === 'card') setCashReceivedAction(0);
            }}
            className="appearance-none w-full p-2 pr-8 border border-black bg-white text-black text-sm uppercase focus:outline-none"
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
                setCashReceivedAction(isNaN(val) ? 0 : round2Action(val));
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
          <div className="space-y-2">
            <div>
              <label className="text-sm">Cash Portion</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cashReceived === 0 ? '' : cashReceived}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCashReceivedAction(isNaN(val) ? 0 : round2Action(val));
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
                  setCardAmountAction(isNaN(val) ? 0 : round2Action(val));
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
              className="w-full uppercase text-xs p-2 mb-4 border border-gray-300 text-black"
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
      <div className="flex gap-3 w-full">
        {/* Clear Sale Button */}
        <button
          onClick={clearCartAction}
          disabled={cartEmpty || loading}
          className={`w-full py-3 rounded-full text-sm font-semibold uppercase transition duration-200 ease-in-out shadow-sm 
      ${
        cartEmpty || loading
          ? 'bg-red-300 cursor-not-allowed text-white'
          : 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white'
      }`}
        >
          Clear Sale
        </button>

        {/* Complete Sale Button */}
        <button
          onClick={() => setShowConfirmModalAction(true)}
          disabled={loading || cartEmpty}
          className={`w-full py-3 rounded-full text-sm font-semibold uppercase transition duration-200 ease-in-out shadow-sm 
      ${
        loading || cartEmpty
          ? 'bg-gray-300 cursor-not-allowed text-gray-600'
          : 'bg-green hover:bg-gray-800 text-white active:scale-[0.98]'
      }`}
        >
          {loading ? `Processing... $${total.toFixed(2)}` : `Complete Sale`}
        </button>
      </div>
    </div>
  );
}
