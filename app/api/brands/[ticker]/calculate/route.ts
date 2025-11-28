import { NextResponse } from 'next/server';
import { getMockHistorical } from '@/lib/mock-stock-data';
import { format } from 'date-fns';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const { searchParams } = new URL(request.url);
    
    const amount = parseFloat(searchParams.get('amount') || '1000');
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json(
        { success: false, error: 'Date parameter required' },
        { status: 400 }
      );
    }

    const upperTicker = ticker.toUpperCase();
    const entryDate = new Date(dateStr);
    const today = new Date();

    // Fetch historical data from entry date to today
    const result = await getMockHistorical(upperTicker, entryDate, today);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No price data available for this date' },
        { status: 404 }
      );
    }

    // Get entry price (first available price on or after entry date)
    const entryPrice = result[0].close;

    // Get current price (most recent)
    const currentPrice = result[result.length - 1].close;

    // Calculate shares and returns
    const shares = amount / entryPrice;
    const currentValue = shares * currentPrice;
    const profit = currentValue - amount;
    const returnPercent = ((currentValue - amount) / amount) * 100;

    // Fetch S&P 500 for comparison
    const sp500Result = await getMockHistorical('^GSPC', entryDate, today);

    let sp500Return = 0;
    if (sp500Result.length > 0) {
      const sp500EntryPrice = sp500Result[0].close;
      const sp500CurrentPrice = sp500Result[sp500Result.length - 1].close;
      sp500Return = ((sp500CurrentPrice - sp500EntryPrice) / sp500EntryPrice) * 100;
    }

    const vsMarket = returnPercent - sp500Return;

    return NextResponse.json({
      success: true,
      data: {
        ticker: upperTicker,
        investment_amount: amount,
        entry_date: format(entryDate, 'yyyy-MM-dd'),
        entry_price: entryPrice,
        current_price: currentPrice,
        shares: shares,
        current_value: currentValue,
        profit: profit,
        return_percent: returnPercent,
        sp500_return: sp500Return,
        vs_market: vsMarket,
      },
    });
  } catch (error: any) {
    console.error('Error calculating investment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to calculate investment',
      },
      { status: 500 }
    );
  }
}
