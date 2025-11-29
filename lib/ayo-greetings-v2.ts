// Enhanced dynamic greetings that lead with social signals (fandom → finance)

interface StockData {
  ticker: string;
  price: number;
  changePercent: number;
}

interface RecentEvent {
  type: 'earnings' | 'ceo_change' | 'product_launch' | 'guidance' | 'analyst_rating';
  date: string;
  impact: 'positive' | 'negative' | 'neutral';
  summary: string;
}

interface SocialSignals {
  googleTrends?: {
    currentInterest: number;
    weekOverWeekChange: number;
    trend: 'up' | 'down' | 'flat';
  };
  wallStreetBets?: {
    mentions: number;
    sentiment: 'bullish' | 'bearish' | 'neutral';
  };
  brandSubreddit?: {
    totalEngagement: number;
  };
}

interface Greeting {
  primary: string;
  secondary: string;
}

export function getDynamicGreetingV2(
  stock: StockData,
  events: RecentEvent[],
  social?: SocialSignals
): Greeting {
  const latestEvent = events[0];
  const isUp = stock.changePercent > 0;
  const isFlat = Math.abs(stock.changePercent) < 0.5;
  const changeAbs = Math.abs(stock.changePercent).toFixed(1);
  
  // Priority 1: Social buzz divergence (fandom-first approach)
  if (social?.googleTrends) {
    const trendsUp = social.googleTrends.weekOverWeekChange > 20;
    const trendsDown = social.googleTrends.weekOverWeekChange < -20;
    
    // Searches surging but stock down = opportunity signal
    if (trendsUp && !isUp && !isFlat) {
      return {
        primary: `${stock.ticker} searches up ${social.googleTrends.weekOverWeekChange.toFixed(0)}% this week, but stock's down ${changeAbs}%`,
        secondary: "Gen Z is still searching — here's the disconnect"
      };
    }
    
    // Searches surging AND stock up = momentum
    if (trendsUp && isUp) {
      return {
        primary: `${stock.ticker} searches up ${social.googleTrends.weekOverWeekChange.toFixed(0)}%, stock's up ${changeAbs}%`,
        secondary: "Fandom + finance aligned — want to see what's driving it?"
      };
    }
    
    // Searches dropping but stock up = institutional buying
    if (trendsDown && isUp) {
      return {
        primary: `${stock.ticker}'s up ${changeAbs}%, but searches are down ${Math.abs(social.googleTrends.weekOverWeekChange).toFixed(0)}%`,
        secondary: "Wall Street's buying while fans are quiet — here's why"
      };
    }
  }
  
  // Priority 2: r/WallStreetBets buzz
  if (social?.wallStreetBets && social.wallStreetBets.mentions > 5) {
    const sentiment = social.wallStreetBets.sentiment;
    
    if (sentiment === 'bullish' && !isUp) {
      return {
        primary: `r/WallStreetBets is bullish on ${stock.ticker} (${social.wallStreetBets.mentions} mentions), but stock's down ${changeAbs}%`,
        secondary: "Retail's betting against the market — want to know why?"
      };
    }
    
    if (sentiment === 'bearish' && isUp) {
      return {
        primary: `${stock.ticker}'s up ${changeAbs}%, but r/WallStreetBets is bearish`,
        secondary: "Retail vs. institutions — here's the split"
      };
    }
  }
  
  // Priority 3: Earnings (traditional signal)
  if (latestEvent?.type === 'earnings' && isToday(latestEvent.date)) {
    return {
      primary: isUp 
        ? `${stock.ticker} beat earnings — stock's up ${changeAbs}%`
        : `${stock.ticker} missed earnings — stock's down ${changeAbs}%`,
      secondary: "Want me to walk you through what the numbers mean?"
    };
  }
  
  // Priority 4: CEO change
  if (latestEvent?.type === 'ceo_change' && isRecent(latestEvent.date, 7)) {
    return {
      primary: `${stock.ticker}'s ${isUp ? 'up' : 'down'} ${changeAbs}% — the new CEO buzz continues`,
      secondary: "Want to know why Wall Street likes the change?"
    };
  }
  
  // Priority 5: Flat day (make it interesting)
  if (isFlat) {
    if (social?.googleTrends && social.googleTrends.currentInterest > 70) {
      return {
        primary: `${stock.ticker}'s flat today, but search interest is at ${social.googleTrends.currentInterest}/100`,
        secondary: "Fans are watching — want the 60-second story?"
      };
    }
    return {
      primary: `${stock.ticker}'s flat today, but a lot happened this year`,
      secondary: "Want the 60-second story?"
    };
  }
  
  // Priority 6: Big move down
  if (!isUp && parseFloat(changeAbs) > 2) {
    return {
      primary: `${stock.ticker}'s down ${changeAbs}% today — but here's why that's not the full story`,
      secondary: "Want me to walk you through what happened?"
    };
  }
  
  // Default: Just stock movement
  return {
    primary: `${stock.ticker}'s ${isUp ? 'up' : 'down'} ${changeAbs}% today`,
    secondary: "Want me to walk you through what happened?"
  };
}

function isToday(date: string): boolean {
  const eventDate = new Date(date);
  const today = new Date();
  return eventDate.toDateString() === today.toDateString();
}

function isRecent(date: string, days: number): boolean {
  const eventDate = new Date(date);
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  return eventDate > daysAgo;
}
