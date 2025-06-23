import React from 'react';

interface ReservationDetailsProps {
  orderNumber: string;
  email: string | null;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  orderNumber,
  email,
}) => {
  return (
    <div className="bg-green-50 dark:bg-green-800 p-6 mb-8 text-center">
      <h3 className="font-light text-sm uppercase text-gray-800 dark:text-gray-200 mb-2">
        Reservation Details
      </h3>
      <ul className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400 space-y-1">
        <li>
          🧾 <span>Reservation #:</span>{' '}
          <span
            className="text-green-600 dark:text-green-400"
            title={orderNumber}
          >
            {orderNumber.slice(-6)}
          </span>
        </li>

        {email && (
          <li>
            📧 <span>Email:</span>{' '}
            <span className="text-green-600 dark:text-green-400">{email}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ReservationDetails;
