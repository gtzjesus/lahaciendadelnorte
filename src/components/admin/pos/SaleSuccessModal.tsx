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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-flag-red text-black space-y-6 p-6 font-bold  backdrop-blur-sm"
      style={{ backgroundImage: "url('/admin/success.webp')" }}
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
    >
      {/* Animated Success Message */}
      <motion.h2
        className="text-xl font-bold text-green 
        "
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        Order created successfully!
      </motion.h2>

      <p
        className="text-md 
       font-light"
      >
        Order #{orderNumber}
      </p>
      <p
        className="text-md font-light 
      "
      >
        Stay here to create a new order or
      </p>

      {/* Static-size button with fixed width */}
      <motion.button
        onClick={() => {
          router.push('/admin/orders');
          if (onClose) onClose();
        }}
        className="py-2 px-6 rounded-full bg-flag-blue text-white text-xs font-semibold 
         transition duration-200 ease-in-out shadow-sm z-50"
      >
        View Order
      </motion.button>
    </motion.div>
  );
}
