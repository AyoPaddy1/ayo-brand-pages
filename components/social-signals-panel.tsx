'use client';

import { useEffect, useState } from 'react';

interface SocialSignalsData {
  wallStreetBets?: {
    ticker: string;
    mentions: number;
    sentiment: 'bullish' | 'bearish' | 'neutral';
    topPost?: {
      title: string;
      score: number;
      comments: number;
      url: string;
    };
  };
  brandSubreddit?: {
    ticker: string;
    subreddit: string;
    postCount: number;
    totalEngagement: number;
    avgEngagement: number;
  };
  googleTrends?: {
    ticker: string;
    brand: string;
    currentInterest: number;
    weekOverWeekChange: number;
    trend: 'up' | 'down' | 'flat';
  };
}

interface SocialSignalsPanelProps {
  ticker: string;
}

export default function SocialSignalsPanel({ ticker }: SocialSignalsPanelProps) {
  const [signals, setSignals] = useState<SocialSignalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSignals() {
      try {
        setLoading(true);
        const response = await fetch(`/api/social-signals/${ticker}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch social signals');
        }
        
        const data = await response.json();
        setSignals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchSignals();
  }, [ticker]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Social Signals</h3>
        <div className="space-y-4">
          <div className="animate-pulse bg-zinc-800 h-20 rounded-lg"></div>
          <div className="animate-pulse bg-zinc-800 h-20 rounded-lg"></div>
          <div className="animate-pulse bg-zinc-800 h-20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !signals) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Social Signals</h3>
        <p className="text-zinc-400">Unable to load social signals</p>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const getTrendEmoji = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Social Signals</h3>
      
      <div className="space-y-4">
        {/* Google Trends */}
        {signals.googleTrends && (
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">Google Trends</h4>
                <p className="text-xs text-zinc-500">Search interest (US)</p>
              </div>
              <span className="text-2xl">{getTrendEmoji(signals.googleTrends.trend)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {signals.googleTrends.currentInterest}
              </span>
              <span className="text-sm text-zinc-400">/100</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-semibold ${
                signals.googleTrends.weekOverWeekChange > 0 ? 'text-green-400' : 
                signals.googleTrends.weekOverWeekChange < 0 ? 'text-red-400' : 
                'text-zinc-400'
              }`}>
                {signals.googleTrends.weekOverWeekChange > 0 ? '+' : ''}
                {signals.googleTrends.weekOverWeekChange.toFixed(1)}%
              </span>
              <span className="text-xs text-zinc-500 ml-2">vs last week</span>
            </div>
          </div>
        )}

        {/* r/WallStreetBets */}
        {signals.wallStreetBets && (
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">r/WallStreetBets</h4>
                <p className="text-xs text-zinc-500">Retail investor sentiment</p>
              </div>
              <span className="text-2xl">{getSentimentEmoji(signals.wallStreetBets.sentiment)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {signals.wallStreetBets.mentions}
              </span>
              <span className="text-sm text-zinc-400">mentions</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-semibold ${getSentimentColor(signals.wallStreetBets.sentiment)}`}>
                {signals.wallStreetBets.sentiment.toUpperCase()}
              </span>
              <span className="text-xs text-zinc-500 ml-2">in top 100 posts</span>
            </div>
            {signals.wallStreetBets.topPost && (
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <p className="text-xs text-zinc-400 mb-1">Top post:</p>
                <a 
                  href={signals.wallStreetBets.topPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 line-clamp-2"
                >
                  {signals.wallStreetBets.topPost.title}
                </a>
                <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                  <span>↑ {signals.wallStreetBets.topPost.score.toLocaleString()}</span>
                  <span>💬 {signals.wallStreetBets.topPost.comments.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand Subreddit */}
        {signals.brandSubreddit && signals.brandSubreddit.subreddit && (
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-zinc-300">r/{signals.brandSubreddit.subreddit}</h4>
                <p className="text-xs text-zinc-500">Fan community activity</p>
              </div>
              <span className="text-2xl">💬</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {signals.brandSubreddit.totalEngagement.toLocaleString()}
              </span>
              <span className="text-sm text-zinc-400">engagement</span>
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              {signals.brandSubreddit.postCount} posts • Avg {signals.brandSubreddit.avgEngagement} per post
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">
          Social signals update hourly. Data from Reddit, Google Trends.
        </p>
      </div>
    </div>
  );
}
