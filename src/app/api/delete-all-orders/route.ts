import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST() {
  try {
    // Fetch all order IDs
    const orders = await backendClient.fetch(`*[_type == "order"]{_id}`);

    if (orders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No orders to delete.',
      });
    }

    // Delete orders in batch
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const deleteMutations = orders.map((order: any) => ({
      delete: { id: order._id },
    }));

    await backendClient.transaction(deleteMutations).commit();

    return NextResponse.json({ success: true, message: 'All orders deleted.' });
  } catch (error: any) {
    console.error('Failed to delete orders:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
