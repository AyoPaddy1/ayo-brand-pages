'use client';

import { useState, useEffect } from 'react';

interface ContextualNudgeProps {
  targetElement: string;
  message: string;
  actionLabel?: string;
  onAction: () => void;
  delayMs?: number;
}

export function ContextualNudge({
  targetElement,
  message,
  actionLabel = "Tell me more",
  onAction,
  delayMs = 5000
}: ContextualNudgeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    if (hasBeenDismissed) return;

    let pauseTimer: NodeJS.Timeout;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // User is viewing this element
            pauseTimer = setTimeout(() => {
              setIsVisible(true);
            }, delayMs);
          } else {
            // User scrolled away
            clearTimeout(pauseTimer);
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.5 } // Element must be 50% visible
    );

    const element = document.querySelector(targetElement);
    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(pauseTimer);
      observer.disconnect();
    };
  }, [targetElement, hasBeenDismissed, delayMs]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-8 bg-white border-2 border-teal-500 rounded-lg shadow-2xl p-4 max-w-xs sm:max-w-sm animate-bounce-in z-40">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-yellow-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 mb-3">
            {message}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onAction();
                setIsVisible(false);
                setHasBeenDismissed(true);
              }}
              className="px-3 py-1.5 bg-teal-500 text-white text-sm rounded hover:bg-teal-600 transition-colors"
            >
              {actionLabel}
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                setHasBeenDismissed(true);
              }}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
