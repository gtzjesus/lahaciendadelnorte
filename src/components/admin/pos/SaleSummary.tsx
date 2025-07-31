'use client';

import React from 'react';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type Props = {
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'split';
  setPaymentMethodAction: (method: 'cash' | 'card' | 'split') => void;
  cashReceived: number;
  setCashReceivedAction: (amount: number) => void;
  cardAmount: number;
  setCardAmountAction: (amount: number) => void;
  round2Action: (n: number) => number;
  changeGiven: number;
  showConfirmModal: boolean;
  setShowConfirmModalAction: (v: boolean) => void;
  customerName: string;
  setCustomerNameAction: (name: string) => void;
  loading: boolean;
  handleSaleAction: () => Promise<void>;
  clearCartAction: () => void;
  cartEmpty: boolean;
};

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
}: Props) {
  return (
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

      {/* Payment Method */}
      <div className="mt-4 mb-4 text-black font-bold">
        <label className="block uppercase text-sm">Payment Method</label>
        <div className="relative w-full mt-2">
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
      <button
        onClick={() => setShowConfirmModalAction(true)}
        disabled={loading || cartEmpty}
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
        onClick={clearCartAction}
        disabled={cartEmpty || loading}
        className="p-4 mb-2 block uppercase text-md font-bold text-center bg-red-500 text-white w-full"
      >
        Clear Sale
      </button>
    </div>
  );
}
