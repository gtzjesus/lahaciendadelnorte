// app/services/ordersService.ts
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function fetchOrders(): Promise<{
  orders: any[];
  success: boolean;
}> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/admin/orders/get-all-orders`, {
      cache: 'no-store',
    });
    const json = await res.json();
    return { orders: json.orders || [], success: json.success };
  } catch (err) {
    console.error('❌ Server render error in fetchOrders:', err);
    return { orders: [], success: false };
  }
}
