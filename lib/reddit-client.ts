/**
 * Reddit API Client
 * Direct HTTP calls to Reddit's public JSON API (no auth required)
 */

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    score: number;
    num_comments: number;
    created_utc: number;
    permalink: string;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

/**
 * Fetch hot posts from a subreddit using Reddit's public JSON API
 */
export async function getSubredditPosts(
  subreddit: string,
  limit: number = 100
): Promise<RedditPost[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: 'force-cache' // Use cache aggressively to avoid rate limits
    });

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} for r/${subreddit}`);
      return [];
    }

    const data: RedditResponse = await response.json();
    
    if (!data?.data?.children) {
      console.error(`Invalid Reddit response structure for r/${subreddit}`);
      return [];
    }
    
    return data.data.children || [];

  } catch (error) {
    console.error(`Error fetching r/${subreddit}:`, error);
    return [];
  }
}
