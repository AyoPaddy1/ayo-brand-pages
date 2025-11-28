'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Brand {
  ticker: string;
  name: string;
  category: string;
  hype_score: number;
  confidence: number;
  current_price: number;
  change_percent: number;
  market_cap: number;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBrands(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching brands:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-400 to-yellow-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading brands...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-400 to-yellow-400 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-6xl font-bold text-white mb-4">
          Brands You Follow
        </h1>
        <p className="text-2xl text-white/90">
          What's happening with the stocks behind brands you love
        </p>
        <p className="text-lg text-white/80 mt-2">
          Think of it as <span className="font-semibold">"Spotify Wrapped for investing curiosity"</span>
        </p>
      </div>

      {/* Brand Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.ticker}
            href={`/brands/${brand.ticker.toLowerCase()}`}
            className="group"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
              {/* Brand Name */}
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {brand.name}
                </h2>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {brand.ticker}
                </p>
              </div>

              {/* Current Price */}
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  ${brand.current_price.toFixed(2)}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    brand.change_percent >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {brand.change_percent >= 0 ? '+' : ''}
                  {brand.change_percent.toFixed(2)}% today
                </div>
              </div>

              {/* Social Buzz Indicator */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Social Buzz:</span>
                <span className="text-lg font-bold">
                  {brand.hype_score >= 85 && "🔥 Very High"}
                  {brand.hype_score >= 70 && brand.hype_score < 85 && "⚡ High"}
                  {brand.hype_score >= 50 && brand.hype_score < 70 && "📊 Moderate"}
                  {brand.hype_score < 50 && "📉 Low"}
                </span>
              </div>

              {/* Context Hook */}
              <div className="text-sm text-gray-600 italic leading-relaxed">
                {brand.ticker === 'NKE' && "Recovering from a tough year, new CEO driving change"}
                {brand.ticker === 'AAPL' && "iPhone 16 demand stronger than expected"}
                {brand.ticker === 'TSLA' && "Cybertruck production ramping up"}
                {brand.ticker === 'NFLX' && "Password sharing crackdown paying off"}
              </div>

              {/* Hover indicator */}
              <div className="mt-4 text-center text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                View Investment Story →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-white/80">
        <p className="text-sm">
          Powered by AYO Co-Pilot • Real-time data from Yahoo Finance
        </p>
      </div>
    </div>
  );
}
