'use client';

import { useState, useEffect } from 'react';

export interface StorySection {
  id: number;
  title: string;
  text: string;
  scrollTo: string;
  highlight: string;
  duration: number; // milliseconds to pause on this section
}

interface GuidedStoryWalkthroughProps {
  sections: StorySection[];
  isActive: boolean;
  onClose: () => void;
}

export function GuidedStoryWalkthrough({ 
  sections, 
  isActive, 
  onClose 
}: GuidedStoryWalkthroughProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const section = sections[currentSection];
    if (!section) return;
    
    // Scroll to section
    const element = document.querySelector(section.scrollTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Highlight element
    const highlight = document.querySelector(section.highlight);
    if (highlight) {
      highlight.classList.add('ayo-highlight');
    }
    
    // Auto-advance after duration
    const timer = setTimeout(() => {
      // Remove highlight
      if (highlight) {
        highlight.classList.remove('ayo-highlight');
      }
      
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        // Tour complete
        onClose();
      }
    }, section.duration);

    return () => {
      clearTimeout(timer);
      if (highlight) {
        highlight.classList.remove('ayo-highlight');
      }
    };
  }, [isActive, currentSection, isPaused, sections, onClose]);

  // Reset when tour becomes active
  useEffect(() => {
    if (isActive) {
      setCurrentSection(0);
      setIsPaused(false);
    }
  }, [isActive]);

  if (!isActive) return null;

  const section = sections[currentSection];
  if (!section) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-teal-500 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSection(i);
                setIsPaused(true);
              }}
              className={`h-2 rounded-full transition-all ${
                i === currentSection 
                  ? 'bg-teal-500 w-8' 
                  : i < currentSection 
                    ? 'bg-teal-300 w-2' 
                    : 'bg-gray-300 w-2'
              }`}
              aria-label={`Go to section ${i + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Section content */}
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-teal-600 mb-2">
            {section.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-900 leading-relaxed max-w-2xl mx-auto">
            {section.text}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <button
            onClick={() => {
              if (currentSection > 0) {
                setCurrentSection(currentSection - 1);
                setIsPaused(true);
              }
            }}
            disabled={currentSection === 0}
            className="text-sm text-gray-600 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          <button
            onClick={() => {
              if (currentSection < sections.length - 1) {
                setCurrentSection(currentSection + 1);
                setIsPaused(true);
              }
            }}
            disabled={currentSection === sections.length - 1}
            className="text-sm text-gray-600 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>

          <button
            onClick={onClose}
            className="ml-2 sm:ml-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}
