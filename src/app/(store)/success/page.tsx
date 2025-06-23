'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import useBasketStore from '../../../../store/store';
import { motion } from 'framer-motion';

import ReservationDetails from '../../../components/reservations/ReservationDetails'; // component
import { useSuccessPage } from '@/app/hooks/reservation/useSucessPage';
import { useEffect } from 'react';
import ActionButtons from '@/components/common/ActionButtons';

function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const email = searchParams.get('email');
  const clearBasket = useBasketStore((state) => state.clearBasket);
  const router = useRouter();

  const { countdown } = useSuccessPage(orderNumber, clearBasket);

  // Redirect when countdown hits zero
  useEffect(() => {
    if (countdown === 0 && orderNumber) {
      router.push('/orders');
    }
  }, [countdown, router, orderNumber]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-flag-red dark:bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 p-10 sm:p-12 rounded-xl shadow-xl max-w-2xl w-full"
      >
        {/* Checkmark Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 bg-flag-blue dark:bg-green-600 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-lg text-center mb-2 text-green-700 dark:text-green-400 uppercase font-light">
          Fireworks Reserved!
        </h1>

        {/* Instructions */}
        <p className="text-xs text-gray-700 dark:text-gray-300 text-center mb-6">
          Your fireworks have been reserved. <br />
          Please visit the store to complete payment and pickup.
        </p>

        {/* Reservation Details */}
        {orderNumber && (
          <ReservationDetails orderNumber={orderNumber} email={email} />
        )}

        {/* Countdown */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
          Redirecting to your reservation in <strong>{countdown}</strong>{' '}
          seconds...
        </p>

        {/* Buttons */}
        <ActionButtons />
      </motion.div>
    </div>
  );
}

export default SuccessPage;
