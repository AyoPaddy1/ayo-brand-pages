import { NextRequest, NextResponse } from 'next/server';
import { getSocialSignals } from '@/lib/social-signals-v2';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker.toUpperCase();
    
    // Validate ticker
    const validTickers = ['NKE', 'AAPL', 'TSLA', 'NFLX'];
    if (!validTickers.includes(ticker)) {
      return NextResponse.json(
        { error: 'Invalid ticker' },
        { status: 400 }
      );
    }

    const signals = await getSocialSignals(ticker);

    return NextResponse.json(signals, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

  } catch (error) {
    console.error('Error fetching social signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social signals' },
      { status: 500 }
    );
  }
}
