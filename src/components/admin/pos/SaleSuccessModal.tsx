'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SaleSuccessModalProps {
  orderNumber: string;
  onCloseAction: () => void; // Make onCloseAction required if you want to trigger modal hide
}

export default function SaleSuccessModal({
  orderNumber,
  onCloseAction,
}: SaleSuccessModalProps) {
  const router = useRouter();

  const handleViewOrders = () => {
    // First close modal (if needed), then route
    onCloseAction(); // Ensure modal hides properly
    // Small timeout to let modal close animation play out
    setTimeout(() => {
      router.push('/admin/orders');
    }, 100); // 100ms is usually enough, adjust if needed
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-flag-red/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative bg-flag-red rounded-2xl shadow-2xl px-8 py-10 text-center w-full max-w-sm overflow-hidden"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Confetti sparkles with pure CSS */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/admin/confetti.png')] bg-cover opacity-20" />

        <motion.h2
          className="text-2xl font-extrabold text-flag-green z-10 relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Success!
        </motion.h2>

        <motion.p
          className="text-md font-medium text-gray-700 mt-2 z-10 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Order #{orderNumber}
        </motion.p>

        <p className="text-sm font-light text-gray-500 mt-1 z-10 relative">
          What would you like to do next?
        </p>

        <div className="flex flex-col gap-3 mt-6 z-10 relative">
          {/* Create Another Order */}
          <motion.button
            onClick={onCloseAction}
            className="py-2 px-6 rounded-full bg-flag-red text-flag-red text-sm font-semibold shadow hover:bg-gray-100 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Another Order
          </motion.button>

          {/* View Orders */}
          <motion.button
            onClick={handleViewOrders}
            className="py-2 px-6 rounded-full bg-flag-blue text-white text-sm font-semibold shadow hover:bg-blue-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Orders
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
