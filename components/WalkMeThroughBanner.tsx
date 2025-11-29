'use client';

import { useState, useEffect } from 'react';

interface WalkMeThroughBannerProps {
  onStartWalkthrough: () => void;
}

export function WalkMeThroughBanner({ onStartWalkthrough }: WalkMeThroughBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has seen the banner before
    const hasSeenBanner = localStorage.getItem('ayo_seen_walkthrough_banner');
    
    if (!hasSeenBanner) {
      // Show banner after a short delay
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('ayo_seen_walkthrough_banner', 'true');
    }, 300);
  };

  const handleStartWalkthrough = () => {
    handleDismiss();
    onStartWalkthrough();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-gradient-to-r from-teal-500 via-emerald-400 to-yellow-400 p-1 rounded-2xl shadow-2xl">
        <div className="bg-gray-900 rounded-xl p-6 max-w-md">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">
                First time here?
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Let AYO walk you through how social buzz connects to stock movements. Takes 2 minutes.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleStartWalkthrough}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  ▶ Walk Me Through
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
