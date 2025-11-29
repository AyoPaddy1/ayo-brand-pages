/**
 * Social Signals Library
 * Fetches social media data to bridge fandom to finance
 */

import { callDataApi } from "@/server/_core/dataApi";
import { getGoogleTrends, type GoogleTrendsData } from './google-trends';

// Cache duration: 1 hour for social signals
const CACHE_DURATION = 60 * 60 * 1000;

interface RedditPost {
  title: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  selftext?: string;
}

interface WallStreetBetsSignal {
  ticker: string;
  mentions: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  topPost?: {
    title: string;
    score: number;
    comments: number;
    url: string;
  };
  lastUpdated: number;
}

interface BrandSubredditSignal {
  ticker: string;
  subreddit: string;
  postCount: number;
  totalEngagement: number;
  avgEngagement: number;
  lastUpdated: number;
}

type GoogleTrendsSignal = GoogleTrendsData;

interface TikTokSignal {
  ticker: string;
  brand: string;
  videoCount: number;
  hashtag: string;
  lastUpdated: number;
}

interface SocialSignals {
  wallStreetBets?: WallStreetBetsSignal;
  brandSubreddit?: BrandSubredditSignal;
  googleTrends?: GoogleTrendsSignal;
  tiktok?: TikTokSignal;
}

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Get r/WallStreetBets mentions for a ticker
 */
export async function getWallStreetBetsSignal(ticker: string): Promise<WallStreetBetsSignal> {
  const cacheKey = `wsb:${ticker}`;
  const cached = getCached<WallStreetBetsSignal>(cacheKey);
  if (cached) return cached;

  try {
    const result = await callDataApi("Reddit/AccessAPI", {
      query: {
        subreddit: 'wallstreetbets',
        limit: '100'
      }
    });

    if (!result || !result.success) {
      throw new Error('Failed to fetch r/WallStreetBets data');
    }

    const posts = result.posts || [];
    const keywords = [ticker, getTickerName(ticker)];
    const mentions: Array<{ post: RedditPost; sentiment: string }> = [];

    // Find mentions
    for (const postWrapper of posts) {
      const post = postWrapper.data;
      const combinedText = `${post.title} ${post.selftext || ''}`.toUpperCase();
      
      for (const keyword of keywords) {
        if (combinedText.includes(keyword.toUpperCase())) {
          // Simple sentiment analysis
          const bullishWords = ['CALLS', 'MOON', 'BUY', 'BULLISH', 'LONG', 'ROCKET', '🚀'];
          const bearishWords = ['PUTS', 'SHORT', 'BEARISH', 'SELL', 'DUMP'];
          
          let sentiment = 'neutral';
          if (bullishWords.some(word => combinedText.includes(word))) {
            sentiment = 'bullish';
          } else if (bearishWords.some(word => combinedText.includes(word))) {
            sentiment = 'bearish';
          }
          
          mentions.push({ post, sentiment });
          break;
        }
      }
    }

    // Calculate overall sentiment
    const bullishCount = mentions.filter(m => m.sentiment === 'bullish').length;
    const bearishCount = mentions.filter(m => m.sentiment === 'bearish').length;
    const overallSentiment = bullishCount > bearishCount ? 'bullish' : 
                            bearishCount > bullishCount ? 'bearish' : 'neutral';

    // Get top post
    const sortedMentions = mentions.sort((a, b) => b.post.score - a.post.score);
    const topPost = sortedMentions[0] ? {
      title: sortedMentions[0].post.title,
      score: sortedMentions[0].post.score,
      comments: sortedMentions[0].post.num_comments,
      url: `https://reddit.com${sortedMentions[0].post.permalink}`
    } : undefined;

    const signal: WallStreetBetsSignal = {
      ticker,
      mentions: mentions.length,
      sentiment: overallSentiment as 'bullish' | 'bearish' | 'neutral',
      topPost,
      lastUpdated: Date.now()
    };

    setCache(cacheKey, signal);
    return signal;

  } catch (error) {
    console.error('Error fetching WallStreetBets signal:', error);
    return {
      ticker,
      mentions: 0,
      sentiment: 'neutral',
      lastUpdated: Date.now()
    };
  }
}

/**
 * Get brand-specific subreddit signal
 */
export async function getBrandSubredditSignal(ticker: string): Promise<BrandSubredditSignal> {
  const cacheKey = `brand-sub:${ticker}`;
  const cached = getCached<BrandSubredditSignal>(cacheKey);
  if (cached) return cached;

  const subredditMap: Record<string, string> = {
    'NKE': 'sneakers',
    'AAPL': 'apple',
    'TSLA': 'teslamotors',
    'NFLX': 'netflix'
  };

  const subreddit = subredditMap[ticker];
  if (!subreddit) {
    return {
      ticker,
      subreddit: '',
      postCount: 0,
      totalEngagement: 0,
      avgEngagement: 0,
      lastUpdated: Date.now()
    };
  }

  try {
    const result = await callDataApi("Reddit/AccessAPI", {
      query: {
        subreddit,
        limit: '50'
      }
    });

    if (!result || !result.success) {
      throw new Error(`Failed to fetch r/${subreddit} data`);
    }

    const posts = result.posts || [];
    const totalEngagement = posts.reduce((sum: number, postWrapper: any) => {
      const post = postWrapper.data;
      return sum + (post.score || 0) + (post.num_comments || 0);
    }, 0);

    const signal: BrandSubredditSignal = {
      ticker,
      subreddit,
      postCount: posts.length,
      totalEngagement,
      avgEngagement: posts.length > 0 ? Math.floor(totalEngagement / posts.length) : 0,
      lastUpdated: Date.now()
    };

    setCache(cacheKey, signal);
    return signal;

  } catch (error) {
    console.error(`Error fetching r/${subreddit} signal:`, error);
    return {
      ticker,
      subreddit,
      postCount: 0,
      totalEngagement: 0,
      avgEngagement: 0,
      lastUpdated: Date.now()
    };
  }
}

/**
 * Get all social signals for a ticker
 */
export async function getSocialSignals(ticker: string): Promise<SocialSignals> {
  const [wallStreetBets, brandSubreddit, googleTrends] = await Promise.all([
    getWallStreetBetsSignal(ticker),
    getBrandSubredditSignal(ticker),
    getGoogleTrends(ticker)
  ]);

  return {
    wallStreetBets,
    brandSubreddit,
    googleTrends
  };
}

/**
 * Helper: Get brand name from ticker
 */
function getTickerName(ticker: string): string {
  const names: Record<string, string> = {
    'NKE': 'Nike',
    'AAPL': 'Apple',
    'TSLA': 'Tesla',
    'NFLX': 'Netflix'
  };
  return names[ticker] || ticker;
}
