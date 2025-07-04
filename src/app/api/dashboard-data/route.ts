import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

type Order = {
  totalPrice?: number;
};

export async function GET() {
  try {
    const [totalOrders, activeProducts, paidOrders, activeCustomers] =
      await Promise.all([
        client.fetch<number>(`count(*[_type == "order" && status == "paid"])`),
        client.fetch<number>(`count(*[_type == "product"])`),
        client.fetch<Order[]>(
          `*[_type == "order" && status == "paid"]{ totalPrice }`
        ),
        client.fetch<number>(`count(*[_type == "customer"])`),
      ]);

    const totalRevenue = paidOrders.reduce((acc: number, order: Order) => {
      return acc + (order.totalPrice ?? 0);
    }, 0);

    return NextResponse.json({
      totalOrders,
      activeProducts,
      totalRevenue,
      activeCustomers,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Dashboard API error:', err);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data.', message: err.message },
        { status: 500 }
      );
    }

    console.error('Unknown error in dashboard API:', err);
    return NextResponse.json(
      { error: 'Unknown error occurred in dashboard API.' },
      { status: 500 }
    );
  }
}
