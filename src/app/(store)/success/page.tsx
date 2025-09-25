'use client';
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useSearchParams } from 'next/navigation';
// import useBasketStore from '../../../../store/store';
import { motion } from 'framer-motion';

// import ReservationDetails from '../../../components/reservations/ReservationDetails';
// import { useSuccessPage } from '@/app/hooks/reservation/useSucessPage';
import { useEffect } from 'react';
// import ActionButtons from '@/components/(store)/common/ActionButtons';

function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  // const email = searchParams.get('email');
  // const clearBasket = useBasketStore((state) => state.clearBasket);

  // const { countdown } = useSuccessPage(orderNumber, clearBasket);

  // const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (orderNumber) {
      const stored = localStorage.getItem(`order-${orderNumber}`);
      if (stored) {
        // setOrderData(JSON.parse(stored));
      }
    }
  }, [orderNumber]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-flag-red  px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 sm:p-12 rounded-xl shadow-xl max-w-2xl w-full"
      >
        {/* Checkmark Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 bg-flag-light-blue dark:bg-green-600 rounded-full flex items-center justify-center">
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
          submission Confirmed!
        </h1>

        {/* Instructions */}
        <p className="text-xs text-black text-center mb-6">
          Your information has been successfully submitted.
          <br />
          We will call you shortly.
        </p>

        {/* Reservation Details Component */}
        {/* {orderNumber && (
          <ReservationDetails orderNumber={orderNumber} email={email} />
        )} */}

        {/* Order Summary */}
        {/* {orderData && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-6 text-xs text-gray-800  space-y-2">
            <p>
              <strong>Name:</strong> {orderData.customerName}
            </p>
            <p>
              <strong>Phone:</strong> {orderData.phone}
            </p>
            <p>
              <strong>Material:</strong> {orderData.customizations.material}
            </p>
            <p>
              <strong>Roof:</strong> {orderData.customizations.roofType}
            </p>
            <p>
              <strong>Doors:</strong> {orderData.customizations.doors}
            </p>
            <p>
              <strong>Windows:</strong> {orderData.customizations.windows}
            </p>
            <p>
              <strong>Garage:</strong>{' '}
              {orderData.customizations.garage ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Addons:</strong>{' '}
              {orderData.customizations.addons.join(', ') || 'None'}
            </p>
            <p>
              <strong>Estimated Price:</strong> $
              {orderData.totalPrice.toFixed(2)}
            </p>
            <p className="italic text-[10px] text-gray-500">
              Saved at: {new Date(orderData.timestamp).toLocaleString()}
            </p>
        )}
          </div>  */}

        {/* Countdown */}
        {/* <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
          Redirecting to your orders in <strong>{countdown}</strong> seconds...
        </p> */}

        {/* Copy Link */}
        {/* {orderNumber && (
          <div className="mt-4 text-center">
            <button
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              className="text-xs underline text-blue-600 hover:text-blue-800"
            >
              Copy this link for your records
            </button>
          </div>
        )} */}

        {/* Action Buttons */}
        {/* <div className="mt-6">
          <ActionButtons />
        </div> */}
      </motion.div>
    </div>
  );
}

export default SuccessPage;
