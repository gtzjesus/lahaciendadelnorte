'use client';

import React from 'react';
import { SignInButton } from '@clerk/nextjs';

interface OrderSummaryProps {
  /**
   * Total number of items in the basket.
   */
  totalItems: number;

  /**
   * Total price of all items.
   */
  totalPrice: number;

  /**
   * Whether the user is signed in.
   */
  isSignedIn: boolean;

  /**
   * Loading state for checkout action.
   */
  isLoading: boolean;

  /**
   * Callback to trigger checkout flow.
   */
  onCheckout: () => void;
}

/**
 * OrderSummary displays a cart summary with item count,
 * subtotal, and a checkout button.
 *
 * Tax is calculated at checkout via Stripe.
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalItems,
  totalPrice,
  isSignedIn,
  isLoading,
  onCheckout,
}) => {
  return (
    <div className="w-full lg:w-auto lg:sticky h-fit bg-flag-blue p-6 lg:p-12 fixed bottom-0 left-0 lg:left-auto lg:bottom-0 lg:order-last shadow-md">
      <h3 className="uppercase text-xs font-light text-center text-white border-b pb-1">
        Reservation Summary
      </h3>

      <div className="pt-1 space-y-1">
        <p className="flex justify-between uppercase text-xs font-light text-white">
          <span>Total fireworks:</span>
          <span>{totalItems}</span>
        </p>
        <p className="flex justify-between uppercase text-xs font-light text-white">
          <span>
            Subtotal{' '}
            <span className="lowercase">(estimated — pay at store)</span>:
          </span>
          <span>${totalPrice.toFixed(0)}</span>
        </p>
      </div>

      {/* Action button */}
      {isSignedIn ? (
        <button
          onClick={onCheckout}
          disabled={isLoading}
          className="mt-3 w-full text-sm uppercase font-light bg-blue-500 text-white py-3 rounded hover:bg-blue-600 disabled:bg-green-600 transition"
          aria-disabled={isLoading}
        >
          {isLoading ? 'Recerving Fireworks...' : 'Reserve Fireworks'}
        </button>
      ) : (
        <div className="flex items-center justify-center mt-3">
          <SignInButton mode="modal">
            <button
              className="w-full text-sm bg-blue-500 border uppercase py-3 text-white font-light hover:bg-opacity-90 transition"
              onClick={() => {
                // Set a flag to run checkout after login
                sessionStorage.setItem('checkoutAfterLogin', 'true');
              }}
            >
              Reserve Fireworks
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
