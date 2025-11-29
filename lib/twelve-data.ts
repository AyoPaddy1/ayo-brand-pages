/**
 * Twelve Data API Integration
 * Provides real-time stock data for brand pages
 */

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  timestamp: string;
}

export interface TimeSeriesData {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

/**
 * Get real-time stock quote
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  if (!TWELVE_DATA_API_KEY) {
    console.warn('TWELVE_DATA_API_KEY not set, using mock data');
    return null;
  }

  try {
    const url = `${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`;
    const response = await fetch(url, {
      next: { revalidate: 900 } // Cache for 15 minutes
    });

    if (!response.ok) {
      console.error(`Twelve Data API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Check for API error
    if (data.status === 'error') {
      console.error('Twelve Data API error:', data.message);
      return null;
    }

    return {
      symbol: data.symbol,
      name: data.name,
      price: parseFloat(data.close),
      change: parseFloat(data.change),
      percent_change: parseFloat(data.percent_change),
      timestamp: data.datetime
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

/**
 * Get historical time series data (last 30 days)
 */
export async function getTimeSeries(symbol: string, interval: string = '1day', outputsize: number = 30): Promise<TimeSeriesData[]> {
  if (!TWELVE_DATA_API_KEY) {
    console.warn('TWELVE_DATA_API_KEY not set, using mock data');
    return [];
  }

  try {
    const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Twelve Data API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Check for API error
    if (data.status === 'error') {
      console.error('Twelve Data API error:', data.message);
      return [];
    }

    return data.values || [];
  } catch (error) {
    console.error('Error fetching time series:', error);
    return [];
  }
}

/**
 * Get multiple stock quotes in one request (batch)
 */
export async function getBatchQuotes(symbols: string[]): Promise<Record<string, StockQuote | null>> {
  if (!TWELVE_DATA_API_KEY) {
    console.warn('TWELVE_DATA_API_KEY not set, using mock data');
    return {};
  }

  try {
    const symbolsParam = symbols.join(',');
    const url = `${BASE_URL}/quote?symbol=${symbolsParam}&apikey=${TWELVE_DATA_API_KEY}`;
    const response = await fetch(url, {
      next: { revalidate: 900 } // Cache for 15 minutes
    });

    if (!response.ok) {
      console.error(`Twelve Data API error: ${response.status}`);
      return {};
    }

    const data = await response.json();

    // Handle single vs multiple symbols response
    const quotes: Record<string, StockQuote | null> = {};

    if (Array.isArray(data)) {
      // Multiple symbols
      for (const item of data) {
        if (item.status !== 'error') {
          quotes[item.symbol] = {
            symbol: item.symbol,
            name: item.name,
            price: parseFloat(item.close),
            change: parseFloat(item.change),
            percent_change: parseFloat(item.percent_change),
            timestamp: item.datetime
          };
        } else {
          quotes[item.symbol] = null;
        }
      }
    } else {
      // Single symbol
      if (data.status !== 'error') {
        quotes[data.symbol] = {
          symbol: data.symbol,
          name: data.name,
          price: parseFloat(data.close),
          change: parseFloat(data.change),
          percent_change: parseFloat(data.percent_change),
          timestamp: data.datetime
        };
      }
    }

    return quotes;
  } catch (error) {
    console.error('Error fetching batch quotes:', error);
    return {};
  }
}
