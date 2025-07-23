import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Missing orderId' }),
        { status: 400 }
      );
    }

    // Patch the order document's pickupStatus to 'completed'
    const result = await backendClient
      .patch(orderId)
      .set({ pickupStatus: 'completed' })
      .commit();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('❌ API error finishing order:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: (error as Error).message }),
      { status: 500 }
    );
  }
}
