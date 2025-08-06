'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SaleSuccessModalProps {
  orderNumber: string;
  onClose?: () => void; // optional callback if you want to close/hide modal differently
}

export default function SaleSuccessModal({
  orderNumber,
  onClose,
}: SaleSuccessModalProps) {
  const router = useRouter();

  return (
    <motion.div
      className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-flag-red text-black space-y-6 p-6"
      initial={{ opacity: 0, y: '-100%' }}
      animate={{ opacity: 1, y: '0' }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {/* Animated Success Message */}
      <motion.h2
        className="text-xl font-semibold text-green uppercase"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Order Created Successfully!
      </motion.h2>

      <p className="text-md uppercase font-light">Order #{orderNumber}</p>
      <p className="text-md font-light uppercase">
        Stay here to create a new order or
      </p>

      {/* Static-size button with fixed width */}
      <motion.button
        onClick={() => {
          router.push('/admin/orders');
          if (onClose) onClose();
        }}
        className="py-2 px-6 rounded-full bg-white text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm z-50"
        whileHover={{ scale: 1.05 }} // Slight hover effect
      >
        View Order
      </motion.button>
    </motion.div>
  );
}
