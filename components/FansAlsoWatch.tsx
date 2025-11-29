'use client';

interface RelatedBrand {
  ticker: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  relationship: string; // Why fans might care
  category: 'competitor' | 'partner' | 'cultural' | 'ecosystem';
}

interface FansAlsoWatchProps {
  ticker: string;
  brandName: string;
}

export function FansAlsoWatch({ ticker, brandName }: FansAlsoWatchProps) {
  // Mock related brands - in production, this would be curated based on fandom overlap
  const getRelatedBrands = (): RelatedBrand[] => {
    const brandMap: Record<string, RelatedBrand[]> = {
      NKE: [
        {
          ticker: 'ONON',
          name: 'On Running',
          currentPrice: 42.15,
          changePercent: 2.3,
          relationship: 'Stealing Nike\'s running market share with viral CloudTec sneakers',
          category: 'competitor',
        },
        {
          ticker: 'LULU',
          name: 'Lululemon',
          currentPrice: 385.20,
          changePercent: -1.2,
          relationship: 'Competing for the same athleisure fans—yoga vs running',
          category: 'competitor',
        },
        {
          ticker: 'FL',
          name: 'Foot Locker',
          currentPrice: 28.50,
          changePercent: 0.8,
          relationship: 'Nike\'s biggest retail partner—if Foot Locker struggles, Nike feels it',
          category: 'partner',
        },
        {
          ticker: 'SPOT',
          name: 'Spotify',
          currentPrice: 412.30,
          changePercent: 1.5,
          relationship: 'Cultural crossover—athlete playlists and workout culture',
          category: 'cultural',
        },
      ],
      AAPL: [
        {
          ticker: 'MSFT',
          name: 'Microsoft',
          currentPrice: 415.50,
          changePercent: 0.9,
          relationship: 'The other tech giant—if you care about Apple, you care about Microsoft',
          category: 'competitor',
        },
        {
          ticker: 'SPOT',
          name: 'Spotify',
          currentPrice: 412.30,
          changePercent: 1.5,
          relationship: 'Competing with Apple Music for the same listeners',
          category: 'competitor',
        },
        {
          ticker: 'NVDA',
          name: 'NVIDIA',
          currentPrice: 140.20,
          changePercent: 3.2,
          relationship: 'Powers Apple\'s AI features—if NVIDIA wins, Apple wins',
          category: 'ecosystem',
        },
      ],
      TSLA: [
        {
          ticker: 'RIVN',
          name: 'Rivian',
          currentPrice: 12.80,
          changePercent: -2.1,
          relationship: 'The Tesla competitor backed by Amazon—electric trucks for a new generation',
          category: 'competitor',
        },
        {
          ticker: 'F',
          name: 'Ford',
          currentPrice: 10.50,
          changePercent: 1.0,
          relationship: 'Legacy automaker trying to catch Tesla in EVs',
          category: 'competitor',
        },
      ],
      NFLX: [
        {
          ticker: 'DIS',
          name: 'Disney',
          currentPrice: 95.30,
          changePercent: 0.5,
          relationship: 'Disney+ vs Netflix—the streaming wars',
          category: 'competitor',
        },
        {
          ticker: 'SPOT',
          name: 'Spotify',
          currentPrice: 412.30,
          changePercent: 1.5,
          relationship: 'Both fighting for your screen time and subscription dollars',
          category: 'cultural',
        },
      ],
    };

    return brandMap[ticker] || [];
  };

  const relatedBrands = getRelatedBrands();

  if (relatedBrands.length === 0) {
    return null;
  }

  const getCategoryColor = (category: RelatedBrand['category']) => {
    switch (category) {
      case 'competitor':
        return 'bg-red-100 text-red-700';
      case 'partner':
        return 'bg-blue-100 text-blue-700';
      case 'cultural':
        return 'bg-purple-100 text-purple-700';
      case 'ecosystem':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: RelatedBrand['category']) => {
    switch (category) {
      case 'competitor':
        return '⚔️ Competitor';
      case 'partner':
        return '🤝 Partner';
      case 'cultural':
        return '🎨 Cultural';
      case 'ecosystem':
        return '🌐 Ecosystem';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          👀 Fans Also Watch
        </h2>
        <p className="text-sm text-gray-600">
          If you're into {brandName}, you might also want to understand...
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {relatedBrands.map((brand) => (
          <a
            key={brand.ticker}
            href={`/brands/${brand.ticker}`}
            className="border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-gray-500">{brand.ticker}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${brand.currentPrice.toFixed(2)}
                </div>
                <div
                  className={`text-xs font-medium ${
                    brand.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {brand.changePercent >= 0 ? '+' : ''}
                  {brand.changePercent.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="mb-3">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(brand.category)}`}>
                {getCategoryLabel(brand.category)}
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {brand.relationship}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Curated based on fandom overlap, not portfolio correlation
        </p>
      </div>
    </div>
  );
}
