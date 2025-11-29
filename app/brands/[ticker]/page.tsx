'use client';

import { useEffect, useState } from 'react';
import AyoCoach from '@/components/AyoCoach';
import SocialSignalsPanel from '@/components/social-signals-panel';
import { StockChartWithSocial } from '@/components/StockChartWithSocial';
import { InvestmentCTA } from '@/components/InvestmentCTA';
import { WalkMeThroughBanner } from '@/components/WalkMeThroughBanner';
import { getAyoForecastCommentary } from '@/lib/ayo-forecast-commentary';
import { generateSyntheticSocialHistory, mergeSocialWithPriceData } from '@/lib/synthetic-social-history';
import { useParams } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface BrandData {
  ticker: string;
  name: string;
  current_price: number;
  change_percent: number;
  hype_score: number;
  confidence: number;
}

interface PriceData {
  date: string;
  close: number;
}

interface SocialEvent {
  id: number;
  date: string;
  platform: string;
  title: string;
  description: string;
  magnitude: number;
  sentiment: string;
  stock_impact: string;
}

interface KeyEvent {
  id: number;
  date: string;
  event_type: string;
  title: string;
  summary: string;
  stock_impact: string;
}

interface ForecastEvent {
  id: number;
  date: string;
  title: string;
  probability: number;
  expected_impact: string;
}

export default function BrandPage() {
  const params = useParams();
  const ticker = (params?.ticker as string)?.toUpperCase() || '';

  const [brand, setBrand] = useState<BrandData | null>(null);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [socialEvents, setSocialEvents] = useState<SocialEvent[]>([]);
  const [keyEvents, setKeyEvents] = useState<KeyEvent[]>([]);
  const [forecastEvents, setForecastEvents] = useState<ForecastEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [selectedDate, setSelectedDate] = useState('');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [ayoQuestion, setAyoQuestion] = useState('');
  const [ayoResponse, setAyoResponse] = useState<any>(null);
  const [askingAyo, setAskingAyo] = useState(false);
  const [socialSignals, setSocialSignals] = useState<any>(null);

  useEffect(() => {
    if (!ticker) return;

    Promise.all([
      fetch(`/api/brands/${ticker}`).then((r) => r.json()),
      fetch(`/api/brands/${ticker}/prices?period=${selectedPeriod}`).then((r) => r.json()),
      fetch(`/api/brands/${ticker}/events`).then((r) => r.json()),
      fetch(`/api/social-signals/${ticker}`).then((r) => r.json()),
    ])
      .then(([brandRes, pricesRes, eventsRes, socialRes]) => {
        if (brandRes.success) setBrand(brandRes.data);
        if (pricesRes.success) setPrices(pricesRes.data.prices);
        if (eventsRes.success) {
          setSocialEvents(eventsRes.data.social_events);
          setKeyEvents(eventsRes.data.key_events);
          setForecastEvents(eventsRes.data.forecast_events);
        }
        if (socialRes) setSocialSignals(socialRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, [ticker, selectedPeriod]);

  if (loading || !brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  // Generate synthetic social history if we have current social signals
  const socialHistory = socialSignals && socialSignals.googleTrends
    ? generateSyntheticSocialHistory(
        ticker,
        socialSignals.googleTrends.currentInterest,
        socialSignals.wallStreetBets?.mentions || 0,
        prices.length
      )
    : [];

  // Merge social history with price data
  const pricesWithSocial = socialHistory.length > 0
    ? mergeSocialWithPriceData(
        prices.map(p => ({ date: p.date, price: p.close })),
        socialHistory
      )
    : prices.map(p => ({ date: p.date, price: p.close }));

  // Prepare chart data with events and social signals
  const chartData = pricesWithSocial.map((price) => {
    const socialEvent = socialEvents.find((e) => e.date === price.date);
    const keyEvent = keyEvents.find((e) => e.date === price.date);

    return {
      date: price.date,
      price: price.price,
      googleTrends: price.googleTrends,
      redditMentions: price.redditMentions,
      socialMagnitude: socialEvent ? socialEvent.magnitude : null,
      socialPlatform: socialEvent ? socialEvent.platform : null,
      socialTitle: socialEvent ? socialEvent.title : null,
      keyEventType: keyEvent ? keyEvent.event_type : null,
      keyEventTitle: keyEvent ? keyEvent.title : null,
    };
  });

  const handleAskQuestion = async (question: string) => {
    setAyoQuestion(question);
    setAskingAyo(true);
    setAyoResponse(null);

    try {
      const response = await fetch('/api/explain_term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: question, brand: brand.name }),
      });

      const data = await response.json();
      if (data.success) {
        setAyoResponse(data.data);
      }
    } catch (error) {
      console.error('Error asking AYO:', error);
    } finally {
      setAskingAyo(false);
    }
  };

  const handleStartWalkthrough = () => {
    // Scroll to AYO Coach section
    const ayoSection = document.querySelector('.ayo-coach-section');
    if (ayoSection) {
      ayoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Walk Me Through Banner - Shows on first visit */}
      <WalkMeThroughBanner onStartWalkthrough={handleStartWalkthrough} />
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">{brand.name}</h1>
              <p className="text-xl text-white/90">
                {brand.name}'s been through a lot this year. Here's the story.
              </p>
            </div>
            <a
              href="/brands"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ← All Brands
            </a>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-white/70 mb-1">Stock Price</div>
              <div className="text-4xl font-bold">${brand.current_price.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-white/70 mb-1">vs S&P 500</div>
              <div
                className={`text-4xl font-bold ${
                  brand.change_percent >= 0 ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {brand.change_percent >= 0 ? '+' : ''}
                {brand.change_percent.toFixed(1)}%
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* AYO Coach */}
      <AyoCoach
        brandName={brand.name}
        ticker={ticker}
        currentPrice={brand.current_price}
        changePercent={brand.change_percent}
        recentEvents={[...keyEvents, ...socialEvents].map(e => ({
          date: e.date,
          title: e.title,
          type: ('event_type' in e ? e.event_type : 'product_launch') as 'earnings' | 'ceo_change' | 'product_launch' | 'guidance' | 'analyst_rating',
          impact: e.stock_impact === 'positive' ? 'positive' as const : 
                  e.stock_impact === 'negative' ? 'negative' as const : 'neutral' as const,
          summary: 'summary' in e ? e.summary : e.description
        }))}
        onAskQuestion={handleAskQuestion}
      />

      {/* AYO Response Panel */}
      {(askingAyo || ayoResponse) && (
        <div className="max-w-7xl mx-auto px-8 pt-6">
          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6">
            {askingAyo ? (
              <div className="text-center py-8">
                <div className="text-teal-600 text-lg font-semibold">AYO is thinking...</div>
              </div>
            ) : ayoResponse ? (
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    AYO
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">Definition</div>
                    <p className="text-gray-700">{ayoResponse.definition}</p>
                  </div>
                </div>

                {ayoResponse.real_talk && (
                  <div className="mb-4 pl-14">
                    <div className="font-semibold text-gray-900 mb-2">🗣️ Real Talk</div>
                    <p className="text-gray-700">{ayoResponse.real_talk}</p>
                  </div>
                )}

                {ayoResponse.why_it_matters && (
                  <div className="mb-4 pl-14">
                    <div className="font-semibold text-gray-900 mb-2">🎯 Why It Matters</div>
                    <p className="text-gray-700">{ayoResponse.why_it_matters}</p>
                  </div>
                )}

                {ayoResponse.brand_context && (
                  <div className="mb-4 pl-14">
                    <div className="font-semibold text-gray-900 mb-2">🏭 Brand Context</div>
                    <p className="text-gray-700">{ayoResponse.brand_context}</p>
                  </div>
                )}

                <button
                  onClick={() => setAyoResponse(null)}
                  className="ml-14 text-teal-600 font-semibold hover:text-teal-700"
                >
                  ← Ask another question
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Chart Section */}
        <div id="stock-chart" className="stock-chart-container bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">📈 The Story So Far</h2>
            <div className="flex gap-2">
              {['1y', '2y', '3y', '5y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <StockChartWithSocial
            data={chartData}
            brandName={brand.name}
            socialEvents={socialEvents}
            keyEvents={keyEvents}
            currentPrice={brand.current_price}
          />
        </div>

        {/* Investment Calculator */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 If You Invested When TikTok Spiked...</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select an event...</option>
                {socialEvents.map((event) => (
                  <option key={event.id} value={event.date}>
                    {format(parseISO(event.date), 'MMM dd, yyyy')} - {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              if (!selectedDate) return;
              setCalculating(true);
              fetch(`/api/brands/${ticker}/calculate?amount=${investmentAmount}&date=${selectedDate}`)
                .then((r) => r.json())
                .then((data) => {
                  if (data.success) {
                    setCalculationResult(data.data);
                  }
                  setCalculating(false);
                })
                .catch(() => setCalculating(false));
            }}
            disabled={!selectedDate || calculating}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {calculating ? 'Calculating...' : 'Calculate Returns'}
          </button>

          {calculationResult && (
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Current Value</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${calculationResult.current_value.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Your Return</div>
                <div className={`text-2xl font-bold ${
                  calculationResult.return_percent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {calculationResult.return_percent >= 0 ? '+' : ''}
                  {calculationResult.return_percent.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Profit</div>
                <div className={`text-2xl font-bold ${
                  calculationResult.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {calculationResult.profit >= 0 ? '+' : ''}
                  ${calculationResult.profit.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">vs S&P 500</div>
                <div className={`text-2xl font-bold ${
                  calculationResult.vs_market >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {calculationResult.vs_market >= 0 ? '+' : ''}
                  {calculationResult.vs_market.toFixed(1)}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Forecast Section */}
        <div id="forecast" className="forecast-section bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔮 Next 30 Days Forecast</h2>
          <div className="grid grid-cols-3 gap-6">
            {forecastEvents.map((event) => {
              const commentary = getAyoForecastCommentary(ticker, event);
              return (
                <div key={event.id} className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-sm text-gray-600 mb-2">
                    {format(parseISO(event.date), 'MMM dd')}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-3">
                    {event.title}
                  </div>
                  <div className="text-3xl font-bold text-teal-600 mb-3">
                    {event.probability}%
                  </div>
                  
                  {/* AYO Commentary */}
                  <div className="bg-white/60 rounded-lg p-3 mb-3 border border-teal-100">
                    <div className="text-xs font-semibold text-teal-700 mb-1">💬 AYO's Take</div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {commentary.context}
                    </div>
                    <div className="text-sm text-gray-900 font-medium mt-2">
                      {commentary.question}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 font-medium">
                    {event.expected_impact}
                  </div>
                  
                  {/* Stakes */}
                  <div className="text-xs text-teal-700 mt-2 italic">
                    {commentary.stakes}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Investment CTA - NEW */}
        <InvestmentCTA brandName={brand?.name || ticker} ticker={ticker} />

        {/* Social Signals Panel - NEW */}
        <div className="mb-8">
          <SocialSignalsPanel ticker={ticker} />
        </div>

        {/* Events Timeline */}
        <div id="timeline" className="timeline-section grid grid-cols-2 gap-8 mb-8">
          {/* Social Events */}
          <div id="social-signals" className="social-signals-section bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📱 Social Signals</h3>
            <div className="space-y-4">
              {socialEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="border-l-4 border-teal-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {event.platform}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(parseISO(event.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                  <div className="text-xs text-teal-600 font-medium mt-1">
                    Impact: {event.stock_impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Events */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Key Events</h3>
            <div className="space-y-4">
              {keyEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {event.event_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(parseISO(event.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{event.summary}</div>
                  <div className="text-xs text-red-600 font-medium mt-1">
                    Impact: {event.stock_impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
