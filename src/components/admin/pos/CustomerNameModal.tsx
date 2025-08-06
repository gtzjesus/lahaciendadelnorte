// components/CustomerNameModal.tsx
'use client';

import { motion } from 'framer-motion';

interface CustomerNameModalProps {
  customerName: string;
  setCustomerNameAction: (name: string) => void;
  handleSubmit: () => void;
  onClose: () => void;
}

const CustomerNameModal = ({
  customerName,
  setCustomerNameAction,
  handleSubmit,
  onClose,
}: CustomerNameModalProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-6 shadow-xl w-full max-w-md mx-auto text-center"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-md uppercase font-bold mb-3">Confirm Sale</h2>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerNameAction(e.target.value)}
          placeholder="Enter customer name"
          className="w-full uppercase text-xs p-2 mb-4 border border-gray-300 text-black focus:outline-none focus:ring-0"
        />
        <p className="uppercase text-sm mb-4 text-gray-700">
          Are you sure you want to complete this sale for{' '}
          <span className="font-bold text-green">
            ${(parseFloat(customerName) || 0).toFixed(2)}
          </span>
          ?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="uppercase text-sm px-3 py-1 bg-red-500 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
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
      </motion.div>
    </motion.div>
  );
};

export default CustomerNameModal;
