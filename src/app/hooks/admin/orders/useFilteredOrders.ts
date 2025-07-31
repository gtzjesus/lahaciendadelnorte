import { useMemo } from 'react';
import type { Order, OrderFilter } from '@/types/admin/order';

export function useFilteredOrders(
  orders: Order[],
  searchTerm: string,
  filter: OrderFilter
): Order[] {
  return useMemo(() => {
    const term = searchTerm.toLowerCase();

    return orders
      .filter((order) => {
        const matchesOrderNumber = order.orderNumber
          ?.toLowerCase()
          .includes(term);
        const matchesCustomerName = order.customerName
          ?.toLowerCase()
          .includes(term);
        const matchesStatus =
          filter === 'all' || order.pickupStatus?.toLowerCase() === filter;

        return (matchesOrderNumber || matchesCustomerName) && matchesStatus;
      })
      .sort((a, b) => {
        if (a.pickupStatus === b.pickupStatus) return 0;
        if (a.pickupStatus === 'pending') return -1;
        if (b.pickupStatus === 'pending') return 1;
        return 0;
      });
  }, [orders, searchTerm, filter]);
}
