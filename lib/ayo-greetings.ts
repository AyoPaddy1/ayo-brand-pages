// Dynamic context-aware greetings for AYO Coach

interface StockData {
  ticker: string;
  price: number;
  changePercent: number;
  volume?: number;
}

interface RecentEvent {
  type: 'earnings' | 'ceo_change' | 'product_launch' | 'guidance' | 'analyst_rating';
  date: string;
  impact: 'positive' | 'negative' | 'neutral';
  summary: string;
}

interface SocialSignal {
  trend: 'very_high' | 'high' | 'moderate' | 'low';
  platform?: string;
  changePercent?: number;
}

interface Greeting {
  primary: string;
  secondary: string;
}

export function getDynamicGreeting(
  stock: StockData,
  events: RecentEvent[],
  social: SocialSignal
): Greeting {
  const latestEvent = events[0];
  const isUp = stock.changePercent > 0;
  const isFlat = Math.abs(stock.changePercent) < 0.5;
  const changeAbs = Math.abs(stock.changePercent).toFixed(1);
  
  // Earnings day (today)
  if (latestEvent?.type === 'earnings' && isToday(latestEvent.date)) {
    return {
      primary: isUp 
        ? `${stock.ticker} beat earnings — stock's up ${changeAbs}%`
        : `${stock.ticker} missed earnings — stock's down ${changeAbs}%`,
      secondary: "Want me to walk you through what the numbers mean?"
    };
  }
  
  // CEO change (within last 7 days)
  if (latestEvent?.type === 'ceo_change' && isRecent(latestEvent.date, 7)) {
    return {
      primary: `${stock.ticker}'s ${isUp ? 'up' : 'down'} ${changeAbs}% — the new CEO buzz continues`,
      secondary: "Want to know why Wall Street likes the change?"
    };
  }
  
  // Social buzz high but stock down (interesting divergence)
  if (social.trend === 'very_high' && !isUp && !isFlat) {
    return {
      primary: `${stock.ticker}'s down ${changeAbs}%, but TikTok buzz is surging`,
      secondary: "Gen Z is still buying — here's why that matters"
    };
  }
  
  // Stock up, social buzz high (momentum)
  if (isUp && (social.trend === 'very_high' || social.trend === 'high')) {
    return {
      primary: `${stock.ticker}'s up ${changeAbs}% — and social sentiment is strong`,
      secondary: "Want to see what's driving the momentum?"
    };
  }
  
  // Flat day (make it interesting)
  if (isFlat) {
    return {
      primary: `${stock.ticker}'s flat today, but a lot happened this year`,
      secondary: "Want the 60-second story?"
    };
  }
  
  // Stock down significantly
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
