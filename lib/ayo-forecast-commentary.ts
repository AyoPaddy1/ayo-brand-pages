/**
 * AYO Forecast Commentary Generator
 * Adds context, storytelling, and anticipation to forecast events
 */

interface ForecastEvent {
  id: number;
  date: string;
  title: string;
  probability: number;
  expected_impact: string;
}

interface AyoCommentary {
  hook: string; // Attention-grabbing opening
  context: string; // What happened last time / historical context
  question: string; // Key question to build anticipation
  stakes: string; // What's at stake / why it matters
}

/**
 * Generate AYO-style commentary for forecast events
 */
export function getAyoForecastCommentary(
  ticker: string,
  event: ForecastEvent
): AyoCommentary {
  const eventType = event.title.toLowerCase();

  // Earnings commentary
  if (eventType.includes('earnings')) {
    return getEarningsCommentary(ticker, event);
  }

  // Product launch commentary
  if (eventType.includes('launch') || eventType.includes('collab')) {
    return getProductLaunchCommentary(ticker, event);
  }

  // Sales data commentary
  if (eventType.includes('sales') || eventType.includes('holiday')) {
    return getSalesDataCommentary(ticker, event);
  }

  // Analyst rating commentary
  if (eventType.includes('analyst') || eventType.includes('rating')) {
    return getAnalystCommentary(ticker, event);
  }

  // Default commentary
  return {
    hook: `${event.title} is coming up.`,
    context: `This could move the stock.`,
    question: `Will it beat expectations?`,
    stakes: event.expected_impact
  };
}

function getEarningsCommentary(ticker: string, event: ForecastEvent): AyoCommentary {
  const brandContext: Record<string, { lastQuarter: string; keyMetric: string }> = {
    'NKE': {
      lastQuarter: 'Last quarter, Nike missed revenue targets by 10%. Inventory was piling up.',
      keyMetric: 'digital growth >15%'
    },
    'AAPL': {
      lastQuarter: 'Last quarter, iPhone sales were mixed — strong in US, weak in China.',
      keyMetric: 'China revenue stabilization'
    },
    'TSLA': {
      lastQuarter: 'Last quarter, Tesla beat on deliveries but margins compressed.',
      keyMetric: 'Cybertruck production ramp'
    },
    'NFLX': {
      lastQuarter: 'Last quarter, Netflix crushed it — password crackdown worked.',
      keyMetric: 'subscriber additions >5M'
    }
  };

  const context = brandContext[ticker] || {
    lastQuarter: 'Last quarter had mixed results.',
    keyMetric: 'revenue growth'
  };

  const priceTarget = event.expected_impact.match(/\$(\d+)/)?.[1] || '???';
  const upside = event.expected_impact.match(/\+(\d+)%/)?.[1] || '??';

  return {
    hook: `Earnings day is the moment of truth.`,
    context: context.lastQuarter,
    question: `This time, analysts are watching ${context.keyMetric}. Will the turnaround continue?`,
    stakes: `If they beat: stock could jump to $${priceTarget} (+${upside}%). If they miss: expect another selloff.`
  };
}

function getProductLaunchCommentary(ticker: string, event: ForecastEvent): AyoCommentary {
  const productContext: Record<string, string> = {
    'NKE': 'Nike collabs with celebrities usually sell out in minutes. Remember the Travis Scott drop? Stock jumped 3% that week.',
    'AAPL': 'Apple product launches are cultural events. The iPhone 15 launch drove a 5% stock bump.',
    'TSLA': 'Elon\'s product launches are... unpredictable. Cybertruck reveal crashed the stock 6%. But Model 3 launch sent it to the moon.',
    'NFLX': 'Netflix doesn\'t do hardware, but big show launches move the stock. Squid Game season 2 could drive 10M+ new subs.'
  };

  const context = productContext[ticker] || 'Product launches can be stock catalysts.';

  return {
    hook: `New product drop incoming.`,
    context,
    question: `Will it sell out? Will Gen Z care?`,
    stakes: event.expected_impact + '. Hype matters more than you think.'
  };
}

function getSalesDataCommentary(ticker: string, event: ForecastEvent): AyoCommentary {
  return {
    hook: `Holiday sales numbers are about to drop.`,
    context: `Last year, ${ticker === 'NKE' ? 'Nike' : ticker === 'AAPL' ? 'Apple' : ticker === 'TSLA' ? 'Tesla' : 'Netflix'} crushed Black Friday. This year, the economy's shakier.`,
    question: `Did consumers show up? Or did they tighten their wallets?`,
    stakes: event.expected_impact + '. Digital growth is the key metric — if it\'s >15%, bullish.'
  };
}

function getAnalystCommentary(ticker: string, event: ForecastEvent): AyoCommentary {
  return {
    hook: `Wall Street analysts are updating their ratings.`,
    context: `Analysts have been split on ${ticker}. Some see a turnaround, others see more pain ahead.`,
    question: `Will they upgrade or downgrade?`,
    stakes: event.expected_impact + '. A surprise upgrade could trigger a 5%+ pop.'
  };
}

/**
 * Get short version (for card display)
 */
export function getShortCommentary(ticker: string, event: ForecastEvent): string {
  const commentary = getAyoForecastCommentary(ticker, event);
  return `${commentary.context} ${commentary.question}`;
}

/**
 * Get full version (for expanded view)
 */
export function getFullCommentary(ticker: string, event: ForecastEvent): string {
  const commentary = getAyoForecastCommentary(ticker, event);
  return `${commentary.hook}\n\n${commentary.context}\n\n${commentary.question}\n\n${commentary.stakes}`;
}
