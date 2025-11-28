import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const upperTicker = ticker.toUpperCase();

    // Get brand metadata to find brand name
    const { data: brand } = await supabase
      .from('brand_metadata')
      .select('name')
      .eq('ticker', upperTicker)
      .single();

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Get social events
    const { data: socialEvents, error: socialError } = await supabase
      .from('social_events')
      .select('*')
      .eq('ticker', upperTicker)
      .order('date', { ascending: false });

    if (socialError) {
      throw socialError;
    }

    // Get key events
    const { data: keyEvents, error: keyError } = await supabase
      .from('key_events')
      .select('*')
      .eq('ticker', upperTicker)
      .order('date', { ascending: false });

    if (keyError) {
      throw keyError;
    }

    // Get forecast events
    const { data: forecastEvents, error: forecastError } = await supabase
      .from('forecast_events')
      .select('*')
      .eq('ticker', upperTicker)
      .order('date', { ascending: true });

    if (forecastError) {
      throw forecastError;
    }

    return NextResponse.json({
      success: true,
      data: {
        ticker: upperTicker,
        brand: brand.name,
        social_events: socialEvents || [],
        key_events: keyEvents || [],
        forecast_events: forecastEvents || [],
      },
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch events',
      },
      { status: 500 }
    );
  }
}
