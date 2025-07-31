'use client';

import { useRouter } from 'next/navigation';

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-flag-red text-black animate-fadeIn space-y-6 p-6">
      <h2 className="text-3xl font-bold text-green uppercase">Sale Success!</h2>
      <p className="text-lg uppercase">Order #{orderNumber}</p>
      <button
        onClick={() => {
          router.push('/admin/orders');
          if (onClose) onClose();
        }}
        className="px-6 py-3 bg-black text-white font-bold hover:bg-yellow-300 transition uppercase text-sm"
      >
        View order
      </button>
    </div>
  );
}
