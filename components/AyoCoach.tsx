'use client';

import { useState, useEffect } from 'react';

interface AyoCoachProps {
  brandName: string;
  ticker: string;
  currentPrice: number;
  changePercent: number;
  recentEvents: Array<{
    date: string;
    title: string;
    type: string;
  }>;
  onAskQuestion: (question: string) => void;
}

export default function AyoCoach({
  brandName,
  ticker,
  currentPrice,
  changePercent,
  recentEvents,
  onAskQuestion,
}: AyoCoachProps) {
  const [currentSection, setCurrentSection] = useState('overview');

  // Generate context-aware opening line
  const getOpeningLine = () => {
    const isUp = changePercent > 0;
    const isBigMove = Math.abs(changePercent) > 2;

    // Check for recent major events
    const hasRecentEarnings = recentEvents.some(
      (e) => e.type === 'earnings' && 
      new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (hasRecentEarnings) {
      return `${brandName} just reported earnings. Here's what it means for investors...`;
    }

    if (isBigMove && isUp) {
      return `${brandName}'s up ${changePercent.toFixed(1)}% today. Here's what's driving it...`;
    }

    if (isBigMove && !isUp) {
      return `${brandName}'s down ${Math.abs(changePercent).toFixed(1)}% today. Let me explain why...`;
    }

    if (isUp) {
      return `${brandName}'s up ${changePercent.toFixed(1)}% today — recovering from a rough year. Want to know what happened, or jump to what's next?`;
    }

    return `${brandName}'s been through a lot this year. Let me walk you through the story.`;
  };

  // Section-specific prompts
  const getSectionPrompt = () => {
    switch (currentSection) {
      case 'chart':
        return "See those colored dots? Each one is a moment that moved the stock. Tap any to learn why.";
      case 'calculator':
        return "Curious what you'd have if you invested during a key event? Try the calculator.";
      case 'forecast':
        return "These are the upcoming events that could move the stock. Want me to explain any?";
      default:
        return getOpeningLine();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b-2 border-teal-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-start gap-4">
          {/* AYO Avatar */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            AYO
          </div>

          {/* Coach Content */}
          <div className="flex-1">
            <div className="text-gray-900 font-medium mb-3">
              {getSectionPrompt()}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onAskQuestion("What happened this year?")}
                className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-semibold"
              >
                What happened?
              </button>
              <button
                onClick={() => onAskQuestion("What's coming next?")}
                className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-semibold"
              >
                What's next?
              </button>
              <button
                onClick={() => {
                  const input = prompt("What would you like to know?");
                  if (input) onAskQuestion(input);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
              >
                Ask something else
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
