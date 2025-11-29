import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getMockQuote } from '@/lib/mock-stock-data';
import { getStockQuote } from '@/lib/twelve-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const upperTicker = ticker.toUpperCase();

    // Get brand metadata
    const { data: brand, error: brandError } = await supabase
      .from('brand_metadata')
      .select('*')
      .eq('ticker', upperTicker)
      .single();

    if (brandError || !brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Get current stock quote from Twelve Data (fallback to mock if API fails)
    const realQuote = await getStockQuote(upperTicker);
    const quote = realQuote ? {
      regularMarketPrice: realQuote.price,
      regularMarketChangePercent: realQuote.percent_change,
      marketCap: 0, // Not provided by basic quote endpoint
      fiftyTwoWeekHigh: 0, // Would need separate API call
      fiftyTwoWeekLow: 0, // Would need separate API call
      regularMarketVolume: 0, // Not in basic quote
    } : await getMockQuote(upperTicker);

    return NextResponse.json({
      success: true,
      data: {
        ticker: brand.ticker,
        name: brand.name,
        category: brand.category,
        hype_score: brand.current_hype_score,
        confidence: brand.confidence,
        description: brand.description,
        current_price: quote.regularMarketPrice || 0,
        change_percent: quote.regularMarketChangePercent || 0,
        change_percent_ytd: quote.regularMarketChangePercent || 0, // Simplified for MVP
        market_cap: quote.marketCap || 0,
        fifty_two_week_high: quote.fiftyTwoWeekHigh || 0,
        fifty_two_week_low: quote.fiftyTwoWeekLow || 0,
        volume: quote.regularMarketVolume || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch brand',
      },
      { status: 500 }
    );
  }
}
