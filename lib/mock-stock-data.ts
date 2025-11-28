// Mock stock data for testing
// Replace with real Yahoo Finance once API is working

export const mockQuotes: Record<string, any> = {
  NKE: {
    regularMarketPrice: 72.45,
    regularMarketChangePercent: 2.34,
    marketCap: 108500000000,
    fiftyTwoWeekHigh: 123.39,
    fiftyTwoWeekLow: 70.75,
    regularMarketVolume: 8234567,
  },
  AAPL: {
    regularMarketPrice: 189.95,
    regularMarketChangePercent: -0.87,
    marketCap: 2950000000000,
    fiftyTwoWeekHigh: 199.62,
    fiftyTwoWeekLow: 164.08,
    regularMarketVolume: 52345678,
  },
  TSLA: {
    regularMarketPrice: 242.84,
    regularMarketChangePercent: 3.21,
    marketCap: 772000000000,
    fiftyTwoWeekHigh: 299.29,
    fiftyTwoWeekLow: 138.80,
    regularMarketVolume: 98765432,
  },
  NFLX: {
    regularMarketPrice: 487.23,
    regularMarketChangePercent: 1.45,
    marketCap: 209000000000,
    fiftyTwoWeekHigh: 700.99,
    fiftyTwoWeekLow: 344.73,
    regularMarketVolume: 3456789,
  },
};

export function generateMockHistoricalData(ticker: string, days: number = 365): any[] {
  const data = [];
  const basePrice = mockQuotes[ticker]?.regularMarketPrice || 100;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic price movement
    const randomWalk = (Math.random() - 0.5) * 0.03; // ±3% daily movement
    const trendFactor = (days - i) / days; // Gradual trend
    const price = basePrice * (0.85 + trendFactor * 0.15) * (1 + randomWalk);

    data.push({
      date,
      open: price * 0.99,
      high: price * 1.01,
      low: price * 0.98,
      close: price,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }

  return data;
}

export async function getMockQuote(ticker: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockQuotes[ticker] || mockQuotes.AAPL;
}

export async function getMockHistorical(ticker: string, period1: Date, period2: Date) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const days = Math.floor((period2.getTime() - period1.getTime()) / (1000 * 60 * 60 * 24));
  return generateMockHistoricalData(ticker, Math.min(days, 1825)); // Max 5 years
}
