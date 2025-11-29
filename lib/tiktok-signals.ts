/**
 * TikTok Signals Integration
 * Track brand hashtag activity and viral moments
 */

import { callDataApi } from "@/server/_core/dataApi";

export interface TikTokSignal {
  ticker: string;
  brand: string;
  videoCount: number;
  hashtag: string;
  topVideos?: Array<{
    id: string;
    description: string;
    author: string;
  }>;
  lastUpdated: number;
}

// Cache for 1 hour
const cache = new Map<string, { data: TikTokSignal; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Get TikTok hashtag data for a brand
 */
export async function getTikTokSignal(ticker: string): Promise<TikTokSignal> {
  const cacheKey = `tiktok:${ticker}`;
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
    return {
      ticker,
      brand: ticker,
      videoCount: 0,
      hashtag: '',
      lastUpdated: Date.now()
    };
  }

  try {
    const result = await callDataApi("Tiktok/search_tiktok_video_general", {
      query: {
        keyword: brand
      }
    });

    if (!result || !result.data) {
      throw new Error('Failed to fetch TikTok data');
    }

    const videos = result.data || [];
    
    // Get top 3 videos by description
    const topVideos = videos.slice(0, 3).map((video: any) => ({
      id: video.aweme_id || '',
      description: video.desc || '',
      author: video.author?.nickname || 'Unknown'
    }));

    const signal: TikTokSignal = {
      ticker,
      brand,
      videoCount: videos.length,
      hashtag: `#${brand}`,
      topVideos,
      lastUpdated: Date.now()
    };

    cache.set(cacheKey, { data: signal, timestamp: Date.now() });
    return signal;

  } catch (error) {
    console.error(`Error fetching TikTok signal for ${brand}:`, error);
    
    return {
      ticker,
      brand,
      videoCount: 0,
      hashtag: `#${brand}`,
      lastUpdated: Date.now()
    };
  }
}
