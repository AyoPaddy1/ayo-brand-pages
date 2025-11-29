'use client';

import { useState, useEffect } from 'react';

interface InvestmentCalculatorTooltipProps {
  eventName: string;
  eventDate: string;
  priceAtEvent: number;
  currentPrice: number;
  onClose: () => void;
}

export function InvestmentCalculatorTooltip({
  eventName,
  eventDate,
  priceAtEvent,
  currentPrice,
  onClose,
}: InvestmentCalculatorTooltipProps) {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [shares, setShares] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [gain, setGain] = useState(0);
  const [gainPercent, setGainPercent] = useState(0);

  useEffect(() => {
    const calculatedShares = investmentAmount / priceAtEvent;
    const calculatedCurrentValue = calculatedShares * currentPrice;
    const calculatedGain = calculatedCurrentValue - investmentAmount;
    const calculatedGainPercent = (calculatedGain / investmentAmount) * 100;

    setShares(calculatedShares);
    setCurrentValue(calculatedCurrentValue);
    setGain(calculatedGain);
    setGainPercent(calculatedGainPercent);
  }, [investmentAmount, priceAtEvent, currentPrice]);

  return (
    <div className="absolute z-50 bg-gray-900 border-2 border-teal-400 rounded-lg p-4 shadow-2xl min-w-[320px]">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-1">{eventName}</h3>
        <p className="text-gray-400 text-sm">{eventDate}</p>
      </div>

      <div className="mb-4">
        <label className="text-gray-300 text-sm block mb-2">
          If you'd invested here:
        </label>
        <div className="flex items-center gap-2">
          <span className="text-white text-2xl">$</span>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="bg-gray-800 text-white text-2xl font-bold px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            min="100"
            step="100"
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price then:</span>
          <span className="text-white font-mono">${priceAtEvent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Shares bought:</span>
          <span className="text-white font-mono">{shares.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price now:</span>
          <span className="text-white font-mono">${currentPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 font-semibold">Worth today:</span>
          <span className="text-white text-xl font-bold">
            ${currentValue.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-semibold">Gain/Loss:</span>
          <div className="text-right">
            <div
              className={`text-xl font-bold ${
                gain >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {gain >= 0 ? '+' : ''}${gain.toFixed(2)}
            </div>
            <div
              className={`text-sm ${
                gain >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {gain >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
