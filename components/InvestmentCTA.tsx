'use client';

interface InvestmentCTAProps {
  brandName: string;
  ticker: string;
}

export function InvestmentCTA({ brandName, ticker }: InvestmentCTAProps) {
  return (
    <div className="bg-gradient-to-br from-teal-500 via-emerald-400 to-yellow-400 rounded-2xl p-8 my-8">
      <div className="bg-gray-900/90 backdrop-blur rounded-xl p-6">
        <h2 className="text-white text-2xl font-bold mb-2">Ready to start?</h2>
        <p className="text-gray-300 mb-6">
          Open an account in 5 mins and start investing in {brandName}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Robinhood */}
          <a
            href={`https://robinhood.com/stocks/${ticker}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                R
              </div>
              <div>
                <div className="text-white font-semibold">Robinhood</div>
                <div className="text-gray-400 text-xs">Commission-free</div>
              </div>
            </div>
            <div className="text-teal-400 text-sm group-hover:text-teal-300">
              Open account →
            </div>
          </a>

          {/* Trading 212 */}
          <a
            href={`https://www.trading212.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <div className="text-white font-semibold">Trading 212</div>
                <div className="text-gray-400 text-xs">UK & EU friendly</div>
              </div>
            </div>
            <div className="text-teal-400 text-sm group-hover:text-teal-300">
              Open account →
            </div>
          </a>

          {/* Webull */}
          <a
            href={`https://www.webull.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <div>
                <div className="text-white font-semibold">Webull</div>
                <div className="text-gray-400 text-xs">Advanced tools</div>
              </div>
            </div>
            <div className="text-teal-400 text-sm group-hover:text-teal-300">
              Open account →
            </div>
          </a>
        </div>

        <p className="text-gray-400 text-xs mt-4 text-center">
          Investing involves risk. Do your own research before investing.
        </p>
      </div>
    </div>
  );
}
