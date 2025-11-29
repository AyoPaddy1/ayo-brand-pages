/**
 * Google Trends Integration
 * Server-side only - uses pytrends Python library via shell execution
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GoogleTrendsData {
  ticker: string;
  brand: string;
  currentInterest: number; // 0-100
  weekOverWeekChange: number; // percentage
  trend: 'up' | 'down' | 'flat';
  relatedQueries?: Array<{ query: string; value: number }>;
  lastUpdated: number;
}

// Cache for 1 hour
const cache = new Map<string, { data: GoogleTrendsData; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Get Google Trends data for a brand
 * Note: This runs a Python script server-side
 */
export async function getGoogleTrends(ticker: string): Promise<GoogleTrendsData> {
  const cacheKey = `trends:${ticker}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const brandMap: Record<string, string> = {
    'NKE': 'Nike',
    'AAPL': 'Apple',
    'TSLA': 'Tesla',
    'NFLX': 'Netflix'
  };

  const brand = brandMap[ticker];
  if (!brand) {
    throw new Error(`Unknown ticker: ${ticker}`);
  }

  try {
    // Create Python script to fetch trends
    const pythonScript = `
import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from pytrends.request import TrendReq
import json

pytrends = TrendReq(hl='en-US', tz=360, timeout=(5, 10))
pytrends.build_payload(['${brand}'], cat=0, timeframe='today 3-m', geo='US', gprop='')

interest_df = pytrends.interest_over_time()

if not interest_df.empty and '${brand}' in interest_df.columns:
    current_week = int(interest_df['${brand}'].iloc[-1])
    last_week = int(interest_df['${brand}'].iloc[-8]) if len(interest_df) >= 8 else int(interest_df['${brand}'].iloc[0])
    pct_change = round(((current_week - last_week) / last_week * 100) if last_week > 0 else 0, 2)
    trend = 'up' if pct_change > 0 else 'down' if pct_change < 0 else 'flat'
    
    result = {
        'currentInterest': current_week,
        'weekOverWeekChange': pct_change,
        'trend': trend
    }
    
    print(json.dumps(result))
else:
    print(json.dumps({'error': 'No data'}))
`;

    const { stdout, stderr } = await execAsync(`python3 -c ${JSON.stringify(pythonScript)}`);
    
    if (stderr && !stderr.includes('FutureWarning')) {
      console.error('Google Trends error:', stderr);
    }

    const result = JSON.parse(stdout.trim());
    
    if (result.error) {
      throw new Error(result.error);
    }

    const data: GoogleTrendsData = {
      ticker,
      brand,
      currentInterest: result.currentInterest,
      weekOverWeekChange: result.weekOverWeekChange,
      trend: result.trend,
      lastUpdated: Date.now()
    };

    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;

  } catch (error) {
    console.error(`Error fetching Google Trends for ${brand}:`, error);
    
    // Return fallback data
    return {
      ticker,
      brand,
      currentInterest: 0,
      weekOverWeekChange: 0,
      trend: 'flat',
      lastUpdated: Date.now()
    };
  }
}
