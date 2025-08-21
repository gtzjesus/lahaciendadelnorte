'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Loader from '@/components/common/Loader'; // import your loader here

interface SaleSuccessModalProps {
  orderNumber: string;
  onCloseAction: () => void;
}

export default function SaleSuccessModal({
  orderNumber,
  onCloseAction,
}: SaleSuccessModalProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleViewOrders = () => {
    setIsNavigating(true); // start loader
    onCloseAction(); // optional if you want to remove modal visually

    // Wait a bit to let modal animate out before routing
    setTimeout(() => {
      router.push('/admin/orders');
    }, 200);
  };

  if (isNavigating) {
    return <Loader />; // full-screen loader while transitioning
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-flag-red/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative bg-flag-red rounded-2xl shadow-xl px-4 py-10 text-center w-full max-w-xs overflow-hidden"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-0 z-0 pointer-events-none bg-cover opacity-20" />

        <motion.h2
          className="text-2xl font-extrabold text-green z-10 relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Success!
        </motion.h2>

        <motion.p
          className="text-md font-medium mt-2 z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Order #{orderNumber}
        </motion.p>

        <p className="text-sm font-light mt-1 z-10 relative">
          All done! What now?
        </p>

        <div className="flex flex-col gap-3 mt-6 z-10 relative">
          <motion.button
            onClick={onCloseAction}
            className="w-full py-2 rounded-full bg-green text-white text-xs font-bold uppercase transition duration-200 ease-in-out shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start new order
          </motion.button>

          <motion.button
            onClick={handleViewOrders}
            className="w-full py-2 rounded-full bg-flag-blue text-black text-xs font-bold uppercase transition duration-200 ease-in-out shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View order
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
