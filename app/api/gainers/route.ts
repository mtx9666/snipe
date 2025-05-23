import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://stats.jup.ag/top-gainers-10m', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch top gainers');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch top gainers' },
      { status: 500 }
    );
  }
} 