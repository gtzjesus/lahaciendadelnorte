import { motion } from 'framer-motion';

interface CustomerNameModalProps {
  customerName: string;
  setCustomerNameAction: (name: string) => void;
  handleSubmit: () => void;
  onClose: () => void;
  total: number;
  onInputFocus?: () => void; // <-- add these optional props
  onInputBlur?: () => void;
}

const CustomerNameModal = ({
  customerName,
  setCustomerNameAction,
  handleSubmit,
  onClose,
  total,
  onInputFocus, // <-- destructure here
  onInputBlur,
}: CustomerNameModalProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[2000]  flex justify-center items-center bg-flag-red min-h-screen py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-flag-red p-6  w-full h-[50%] max-w-xl text-center space-y-3  overflow-auto"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xs font-semibold text-black uppercase">
          Under what name for this order?
        </h2>

        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerNameAction(e.target.value)}
          placeholder="Enter customer name"
          className="w-full p-2 text-black uppercase text-xs border-none focus:outline-none focus:ring-0"
          onFocus={onInputFocus} // <-- use them here
          onBlur={onInputBlur}
        />

        <p className="text-xs uppercase text-gray-700">
          Are you sure you want to complete this sale for{' '}
          <span className="font-bold text-green">${total.toFixed(2)}</span>?
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm bg-red-500 active:bg-red-700 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!customerName.trim()}
            className={`w-full py-2 rounded-full text-xs font-semibold uppercase transition duration-200 ease-in-out shadow-sm ${
              customerName.trim()
                ? 'bg-green text-white active:scale-[0.98]'
                : 'bg-gray-500 cursor-not-allowed text-white'
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
