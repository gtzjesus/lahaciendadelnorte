'use client';

import QuickStatsSection from '@/components/dashboard/QuickStatsSection';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import RevenueBarChart from '@/components/dashboard/RevenueBarChart';
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats';
import { useRecentOrders } from '@/hooks/dashboard/useRecentOrders';
import { useRevenueStats } from '@/hooks/dashboard/useRevenueStats';
import RevenueIntervalToggle from '@/components/dashboard/RevenueIntervalToggle';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import NewOrderToast from '@/components/orders/NewOrderToast';

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

export default function AdminDashboardPage() {
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );

  const { dashboardData, statsError } = useDashboardStats();
  const { recentOrders, ordersLoading, ordersError } = useRecentOrders();
  const {
    revenueData,
    loading: revenueLoading,
    error: revenueError,
  } = useRevenueStats(interval);

  useEffect(() => {
    if (recentOrders && recentOrders.length > 0) {
      const latest = recentOrders[0];

      if (!isOrderSeen(latest.id)) {
        toast.custom((t) => (
          <NewOrderToast
            t={t}
            orderNumber={latest.orderNumber || ''}
            customerName={latest.customerName}
            totalPrice={latest.totalPrice}
            onView={() => {
              markOrderAsSeen(latest.id);
              window.location.href = `/admin/orders/${latest.orderNumber || ''}`;
            }}
          />
        ));
      }
    }
  }, [recentOrders]);

  if (statsError) {
    return <p className="text-flag-red">Error loading stats.</p>;
  }

  return (
    <>
      <RevenueIntervalToggle onChangeAction={setInterval} active={interval} />
      {revenueError && <p className="text-flag-red">{revenueError}</p>}
      {!revenueLoading && !revenueError && (
        <RevenueBarChart data={revenueData} interval={interval} />
      )}
      <QuickStatsSection data={dashboardData} />
      <RecentOrdersTable
        recentOrders={recentOrders}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
      />
    </>
  );
}
