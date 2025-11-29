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
        'User-Agent': 'AYO-Brand-Pages/1.0'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data: RedditResponse = await response.json();
    return data.data.children || [];

  } catch (error) {
    console.error(`Error fetching r/${subreddit}:`, error);
    return [];
  }
}
