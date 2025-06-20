'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import NewOrderToast from './NewOrderToast';

interface Order {
  id: string;
  orderNumber?: string | number;
  customerName?: string;
  totalPrice?: number;
}

interface OrderNotificationsProps {
  recentOrders: Order[] | undefined;
}

// Util functions for persistent seen order tracking
const getSeenOrders = (): string[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('seenOrders') || '[]');
};

const markOrderAsSeen = (orderId: string) => {
  const seen = getSeenOrders();
  if (!seen.includes(orderId)) {
    seen.push(orderId);
    localStorage.setItem('seenOrders', JSON.stringify(seen));
  }
};

const isOrderSeen = (orderId: string): boolean => {
  const seen = getSeenOrders();
  return seen.includes(orderId);
};

const shownToasts = new Set<string>();

export default function OrderNotifications({
  recentOrders,
}: OrderNotificationsProps) {
  useEffect(() => {
    if (!recentOrders || recentOrders.length === 0) return;

    // Loop through all unseen recent orders
    recentOrders.forEach((order) => {
      if (!isOrderSeen(order.id) && !shownToasts.has(order.id)) {
        shownToasts.add(order.id);
        toast.custom((t) => (
          <NewOrderToast
            t={t}
            orderId={order.id}
            orderNumber={order.orderNumber?.toString() || ''}
            customerName={order.customerName}
            totalPrice={order.totalPrice || 0}
            onView={() => {
              markOrderAsSeen(order.id);
              toast.dismiss(t);
              window.location.href = `/admin/orders/${order.orderNumber || ''}`;
            }}
          />
        ));
      }
    });
  }, [recentOrders]);

  return null; // This component does not render anything visible itself
}
