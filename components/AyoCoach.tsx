'use client';

import { useState, useEffect } from 'react';
import { getDynamicGreeting } from '@/lib/ayo-greetings';
import { getDynamicGreetingV2 } from '@/lib/ayo-greetings-v2';
import { GuidedStoryWalkthrough } from './GuidedStoryWalkthrough';
import { getStorySections } from '@/lib/story-sections';

interface AyoCoachProps {
  brandName: string;
  ticker: string;
  currentPrice: number;
  changePercent: number;
  recentEvents: Array<{
    date: string;
    title: string;
    type: 'earnings' | 'ceo_change' | 'product_launch' | 'guidance' | 'analyst_rating';
    impact?: 'positive' | 'negative' | 'neutral';
    summary?: string;
  }>;
  socialTrend?: 'very_high' | 'high' | 'moderate' | 'low';
  onAskQuestion: (question: string) => void;
}

export default function AyoCoach({
  brandName,
  ticker,
  currentPrice,
  changePercent,
  recentEvents,
  socialTrend = 'moderate',
  onAskQuestion,
}: AyoCoachProps) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [socialSignals, setSocialSignals] = useState<any>(null);

  // Fetch social signals
  useEffect(() => {
    fetch(`/api/social-signals/${ticker}`)
      .then(r => r.json())
      .then(data => setSocialSignals(data))
      .catch(err => console.error('Failed to load social signals:', err));
  }, [ticker]);

  // Get dynamic greeting based on current context
  // Use V2 if social signals are available, otherwise fallback to V1
  const greeting = socialSignals
    ? getDynamicGreetingV2(
        { ticker, price: currentPrice, changePercent },
        recentEvents.map(e => ({
          type: e.type,
          date: e.date,
          impact: e.impact || 'neutral',
          summary: e.summary || e.title
        })),
        socialSignals
      )
    : getDynamicGreeting(
        { ticker, price: currentPrice, changePercent },
        recentEvents.map(e => ({
          type: e.type,
          date: e.date,
          impact: e.impact || 'neutral',
          summary: e.summary || e.title
        })),
        { trend: socialTrend }
      );

  // Get story sections for guided tour
  const storySections = getStorySections(ticker);

  const handleStartTour = () => {
    setIsTourActive(true);
  };

  const handleSkipToForecast = () => {
    const forecastElement = document.querySelector('#forecast');
    if (forecastElement) {
      forecastElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* AYO Avatar */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md">
              AYO
            </div>

            {/* Coach Content */}
            <div className="flex-1 min-w-0">
              {/* Dynamic greeting */}
              <p className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                {greeting.primary}
              </p>
              
              {/* Conversational invitation */}
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                {greeting.secondary}
              </p>
            </div>

            {/* Primary CTA - Desktop */}
            <button
              onClick={handleStartTour}
              className="hidden sm:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-500 to-yellow-400 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex-shrink-0"
            >
              <span className="text-lg">▶</span>
              <span>Walk Me Through</span>
            </button>
          </div>

          {/* Primary CTA - Mobile (full width) */}
          <button
            onClick={handleStartTour}
            className="sm:hidden w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-yellow-400 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <span className="text-lg">▶</span>
            <span>Walk Me Through</span>
          </button>

          {/* Secondary actions */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <button
              onClick={handleSkipToForecast}
              className="text-gray-600 hover:text-teal-600 underline"
            >
              Skip to What's Next
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => {
                const input = prompt("What would you like to know?");
                if (input) onAskQuestion(input);
              }}
              className="text-gray-600 hover:text-teal-600 underline"
            >
              Ask a Question
            </button>
          </div>
        </div>
      </div>

      {/* Guided Story Walkthrough */}
      <GuidedStoryWalkthrough
        sections={storySections}
        isActive={isTourActive}
        onClose={() => setIsTourActive(false)}
      />
    </>
  );
}
