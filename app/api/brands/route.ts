import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getMockQuote } from '@/lib/mock-stock-data';

export async function GET() {
  try {
    // Get brand metadata from database
    const { data: brands, error } = await supabase
      .from('brand_metadata')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    // Fetch current stock prices for each brand
    const brandsWithPrices = await Promise.all(
      (brands || []).map(async (brand) => {
        try {
          const quote = await getMockQuote(brand.ticker);
          
          return {
            ticker: brand.ticker,
            name: brand.name,
            category: brand.category,
            hype_score: brand.current_hype_score,
            confidence: brand.confidence,
            current_price: quote.regularMarketPrice || 0,
            change_percent: quote.regularMarketChangePercent || 0,
            market_cap: quote.marketCap || 0,
          };
        } catch (err) {
          console.error(`Error fetching price for ${brand.ticker}:`, err);
          return {
            ticker: brand.ticker,
            name: brand.name,
            category: brand.category,
            hype_score: brand.current_hype_score,
            confidence: brand.confidence,
            current_price: 0,
            change_percent: 0,
            market_cap: 0,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: brandsWithPrices,
    });
  } catch (error: any) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch brands',
      },
      { status: 500 }
    );
  }
}
