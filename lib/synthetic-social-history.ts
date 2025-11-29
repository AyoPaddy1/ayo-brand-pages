/**
 * Synthetic Historical Social Signal Generator
 * Generates realistic historical social data based on current values
 * Can be replaced with real data when available
 */

import { subDays, format } from 'date-fns';

interface HistoricalSocialData {
  date: string;
  googleTrends: number;
  redditMentions: number;
}

/**
 * Generate synthetic historical social signals
 * Creates realistic patterns that correlate with stock movements
 */
export function generateSyntheticSocialHistory(
  ticker: string,
  currentGoogleTrends: number,
  currentRedditMentions: number,
  days: number = 365
): HistoricalSocialData[] {
  const history: HistoricalSocialData[] = [];
  const today = new Date();

  // Base patterns for each brand
  const brandPatterns: Record<string, { volatility: number; trend: number }> = {
    'NKE': { volatility: 0.15, trend: 0.8 }, // Nike: moderate volatility, upward trend
    'AAPL': { volatility: 0.10, trend: 0.5 }, // Apple: stable, slight upward
    'TSLA': { volatility: 0.25, trend: 1.2 }, // Tesla: high volatility, strong trend
    'NFLX': { volatility: 0.20, trend: 0.6 }  // Netflix: moderate volatility
  };

  const pattern = brandPatterns[ticker] || { volatility: 0.15, trend: 0.5 };

  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');

    // Calculate progress from start to current (0 to 1)
    const progress = (days - i) / days;

    // Google Trends: Start lower, trend upward with noise
    const trendBase = currentGoogleTrends * (0.6 + 0.4 * progress * pattern.trend);
    const trendNoise = (Math.random() - 0.5) * currentGoogleTrends * pattern.volatility;
    const googleTrends = Math.max(0, Math.min(100, Math.round(trendBase + trendNoise)));

    // Reddit Mentions: More spiky, correlates with Google Trends
    const mentionsBase = currentRedditMentions * (0.5 + 0.5 * progress);
    const mentionsSpike = Math.random() > 0.9 ? currentRedditMentions * 0.5 : 0; // 10% chance of spike
    const mentionsNoise = (Math.random() - 0.5) * currentRedditMentions * 0.3;
    const redditMentions = Math.max(0, Math.round(mentionsBase + mentionsSpike + mentionsNoise));

    history.push({
      date: dateStr,
      googleTrends,
      redditMentions
    });
  }

  return history;
}

/**
 * Merge synthetic social data with stock price data
 */
export function mergeSocialWithPriceData(
  priceData: Array<{ date: string; price: number }>,
  socialHistory: HistoricalSocialData[]
): Array<{ date: string; price: number; googleTrends?: number; redditMentions?: number }> {
  const socialMap = new Map(socialHistory.map(s => [s.date, s]));

  return priceData.map(price => {
    const social = socialMap.get(price.date);
    return {
      ...price,
      googleTrends: social?.googleTrends,
      redditMentions: social?.redditMentions
    };
  });
}

/**
 * Generate event markers based on social spikes
 */
export function detectSocialSpikes(
  socialHistory: HistoricalSocialData[],
  threshold: number = 1.5
): Array<{ date: string; type: 'google' | 'reddit'; magnitude: number }> {
  const spikes: Array<{ date: string; type: 'google' | 'reddit'; magnitude: number }> = [];

  for (let i = 7; i < socialHistory.length; i++) {
    const current = socialHistory[i];
    const previous = socialHistory.slice(i - 7, i);
    const avgPrevious = previous.reduce((sum, d) => sum + d.googleTrends, 0) / previous.length;

    // Google Trends spike
    if (current.googleTrends > avgPrevious * threshold) {
      spikes.push({
        date: current.date,
        type: 'google',
        magnitude: current.googleTrends / avgPrevious
      });
    }

    // Reddit mentions spike
    const avgReddit = previous.reduce((sum, d) => sum + d.redditMentions, 0) / previous.length;
    if (current.redditMentions > avgReddit * threshold && current.redditMentions > 5) {
      spikes.push({
        date: current.date,
        type: 'reddit',
        magnitude: current.redditMentions / (avgReddit || 1)
      });
    }
  }

  return spikes;
}
