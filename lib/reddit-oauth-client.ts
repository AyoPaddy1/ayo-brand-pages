/**
 * Reddit OAuth API Client
 * Official Reddit API with OAuth authentication
 * Requires: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USER_AGENT
 */

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const REDDIT_USER_AGENT = process.env.REDDIT_USER_AGENT || 'AYO-Brand-Pages/1.0';

interface RedditAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    score: number;
    num_comments: number;
    created_utc: number;
    permalink: string;
    author: string;
  };
}

interface RedditListingResponse {
  data: {
    children: RedditPost[];
    after: string | null;
  };
}

// Cache for access token
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth access token from Reddit
 */
async function getAccessToken(): Promise<string | null> {
  // Check if we have credentials
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
    console.warn('Reddit OAuth credentials not configured');
    return null;
  }

  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': REDDIT_USER_AGENT
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Reddit OAuth error: ${response.status}`);
      return null;
    }

    const data: RedditAccessToken = await response.json();
    
    // Cache token (expires in 1 hour typically)
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000 // Subtract 60s buffer
    };

    return data.access_token;

  } catch (error) {
    console.error('Error getting Reddit access token:', error);
    return null;
  }
}

/**
 * Fetch posts from a subreddit using OAuth
 */
export async function getSubredditPostsOAuth(
  subreddit: string,
  limit: number = 100,
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all' = 'week'
): Promise<RedditPost[]> {
  const token = await getAccessToken();
  
  if (!token) {
    console.warn('No Reddit OAuth token available');
    return [];
  }

  try {
    const url = `https://oauth.reddit.com/r/${subreddit}/hot?limit=${limit}&t=${timeframe}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': REDDIT_USER_AGENT
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} for r/${subreddit}`);
      return [];
    }

    const data: RedditListingResponse = await response.json();
    return data.data.children || [];

  } catch (error) {
    console.error(`Error fetching r/${subreddit} via OAuth:`, error);
    return [];
  }
}

/**
 * Search for mentions of a keyword across Reddit
 */
export async function searchReddit(
  query: string,
  subreddit?: string,
  limit: number = 100,
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all' = 'week'
): Promise<RedditPost[]> {
  const token = await getAccessToken();
  
  if (!token) {
    console.warn('No Reddit OAuth token available');
    return [];
  }

  try {
    const subredditParam = subreddit ? `&restrict_sr=1` : '';
    const searchPath = subreddit ? `/r/${subreddit}/search` : '/search';
    const url = `https://oauth.reddit.com${searchPath}?q=${encodeURIComponent(query)}&limit=${limit}&t=${timeframe}&sort=top${subredditParam}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': REDDIT_USER_AGENT
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`Reddit search error: ${response.status}`);
      return [];
    }

    const data: RedditListingResponse = await response.json();
    return data.data.children || [];

  } catch (error) {
    console.error(`Error searching Reddit:`, error);
    return [];
  }
}

/**
 * Get historical mention counts for a keyword
 * (Requires multiple API calls for different time periods)
 */
export async function getHistoricalMentions(
  keyword: string,
  subreddit: string,
  days: number = 30
): Promise<Array<{ date: string; count: number }>> {
  // This would require more complex logic with time-based queries
  // For now, return empty array - can be implemented when needed
  console.warn('Historical mentions not yet implemented');
  return [];
}

/**
 * Check if Reddit OAuth is configured
 */
export function isRedditOAuthConfigured(): boolean {
  return !!(REDDIT_CLIENT_ID && REDDIT_CLIENT_SECRET);
}
