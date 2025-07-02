import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
    return NextResponse.json({ sizes });
  } catch (error) {
    console.error('[API] Failed to fetch sizes:', error);
    return NextResponse.json({ sizes: [] }, { status: 500 });
  }
}
