'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';

interface NewsItem {
  id: number;
  title: string;
  source: string;
  published_at: string;
  url: string;
  category: 'culture' | 'business';
  ayo_translation?: string; // AYO's one-liner explanation
}

interface BrandNewsSectionProps {
  ticker: string;
  brandName: string;
}

export function BrandNewsSection({ ticker, brandName }: BrandNewsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'culture' | 'business'>('all');

  // Mock news data - in production, this would come from an API
  const news: NewsItem[] = [
    {
      id: 1,
      title: `${brandName} x Bad Bunny Collab Drops December 1st`,
      source: 'Hypebeast',
      published_at: '2024-11-28T10:00:00Z',
      url: '#',
      category: 'culture',
    },
    {
      id: 2,
      title: `Is ${brandName} Fairly Priced After Direct-to-Consumer Revamp?`,
      source: 'Simply Wall St',
      published_at: '2024-11-27T14:30:00Z',
      url: '#',
      category: 'business',
      ayo_translation: `${brandName} is selling more shoes directly to customers (cutting out stores like Foot Locker). This usually means higher profits, but investors aren't sure if the stock price reflects that yet.`,
    },
    {
      id: 3,
      title: `LeBron James Spotted in New ${brandName} Prototype`,
      source: 'Complex',
      published_at: '2024-11-26T09:15:00Z',
      url: '#',
      category: 'culture',
    },
    {
      id: 4,
      title: `Ex-Dividend Reminder: ${brandName} Dividend Payable January 2`,
      source: 'Nasdaq',
      published_at: '2024-11-25T16:00:00Z',
      url: '#',
      category: 'business',
      ayo_translation: `If you own ${brandName} stock before a certain date, you'll get a cash payment (dividend) in January. It's like a small bonus for being a shareholder.`,
    },
    {
      id: 5,
      title: `${brandName}'s Sustainability Push: Carbon-Neutral Sneakers by 2025`,
      source: 'The Verge',
      published_at: '2024-11-24T11:00:00Z',
      url: '#',
      category: 'culture',
    },
    {
      id: 6,
      title: `Did ${brandName}'s Dividend Increase Signal Stronger Board Confidence?`,
      source: 'Simply Wall St',
      published_at: '2024-11-23T13:45:00Z',
      url: '#',
      category: 'business',
      ayo_translation: `${brandName} just increased the cash they pay to shareholders. This usually means the company's leadership is confident about future profits—they wouldn't give away more cash if they thought trouble was coming.`,
    },
  ];

  const filteredNews = activeTab === 'all' 
    ? news 
    : news.filter(item => item.category === activeTab);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📰 {brandName} News</h2>
        
        {/* Tab Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All News
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'culture'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎨 Culture
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'business'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💼 Business
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.category === 'culture'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.category === 'culture' ? '🎨 Culture' : '💼 Business'}
                  </span>
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <span className="text-xs text-gray-400">
                    {format(parseISO(item.published_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                  {item.title}
                </h3>
                
                {/* AYO Translation for Business News */}
                {item.category === 'business' && item.ayo_translation && (
                  <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        A
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-teal-700 mb-1">
                          AYO explains:
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.ayo_translation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No {activeTab === 'all' ? '' : activeTab} news yet.</p>
          <p className="text-sm mt-2">Check back soon for updates!</p>
        </div>
      )}
    </div>
  );
}
