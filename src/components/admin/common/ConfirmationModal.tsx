'use client';
import { motion } from 'framer-motion';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal = ({
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onClose,
}: ConfirmationModalProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center items-center bg-flag-red bg-opacity-90 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="bg-flag-red p-6 w-full max-w-md text-center space-y-4 shadow-2xl rounded-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-sm font-bold text-black">{title}</h2>
        <p className="text-xs font-light">{message}</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm bg-gray-400  text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm bg-red-600 text-white "
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;
