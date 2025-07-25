import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { currentUser } from '@clerk/nextjs/server';

const ADMIN_EMAILS = ['laduenaice@gmail.com'];

function getWeekStart(date: string): string {
  const d = new Date(date);
  const day = d.getDay(); // Sunday = 0
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!user || !email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const interval = searchParams.get('interval') || 'daily';

    const result = await client.fetch(`
      *[_type == "order" && status == "paid"] {
        orderDate,
        totalPrice
      }
    `);

    const revenueMap: Record<string, number> = {};

    result.forEach((order: { orderDate: string; totalPrice: number }) => {
      let key: string;
      const orderDate = new Date(order.orderDate);

      if (interval === 'weekly') {
        key = getWeekStart(order.orderDate); // yyyy-mm-dd of Monday
      } else if (interval === 'monthly') {
        key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`; // e.g., "2025-06"
      } else {
        key = orderDate.toISOString().split('T')[0]; // Daily
      }

      if (!revenueMap[key]) revenueMap[key] = 0;
      revenueMap[key] += order.totalPrice || 0;
    });

    const data = Object.entries(revenueMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(data);
  } catch (err) {
    console.error('Revenue API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}
