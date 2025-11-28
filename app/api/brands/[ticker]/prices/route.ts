import { NextResponse } from 'next/server';
import { getMockHistorical } from '@/lib/mock-stock-data';
import { subYears, format } from 'date-fns';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const { searchParams } = new URL(request.url);
    
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const periodParam = searchParams.get('period') || '2y'; // Default 2 years

    const upperTicker = ticker.toUpperCase();

    // Calculate date range
    let period1: Date;
    let period2: Date = new Date();

    if (fromParam && toParam) {
      period1 = new Date(fromParam);
      period2 = new Date(toParam);
    } else {
      // Use period parameter
      const yearsBack = periodParam === '1y' ? 1 : periodParam === '3y' ? 3 : periodParam === '5y' ? 5 : 2;
      period1 = subYears(new Date(), yearsBack);
    }

    // Fetch historical data
    const result = await getMockHistorical(upperTicker, period1, period2);

    // Transform data
    const prices = result.map((item) => ({
      date: format(item.date, 'yyyy-MM-dd'),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    return NextResponse.json({
      success: true,
      data: {
        ticker: upperTicker,
        prices,
        period: {
          from: format(period1, 'yyyy-MM-dd'),
          to: format(period2, 'yyyy-MM-dd'),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch prices',
      },
      { status: 500 }
    );
  }
}
