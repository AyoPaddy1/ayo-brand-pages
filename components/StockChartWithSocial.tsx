'use client';

import { useState } from 'react';
import { InvestmentCalculatorTooltip } from './InvestmentCalculatorTooltip';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  ComposedChart
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface ChartDataPoint {
  date: string;
  price: number;
  googleTrends?: number;
  redditMentions?: number;
  socialMagnitude?: number | null;
  socialPlatform?: string | null;
  socialTitle?: string | null;
  keyEventType?: string | null;
  keyEventTitle?: string | null;
}

interface StockChartWithSocialProps {
  data: ChartDataPoint[];
  brandName: string;
  socialEvents: Array<{
    id: number;
    date: string;
    platform: string;
    title: string;
    magnitude: number;
  }>;
  keyEvents: Array<{
    id: number;
    date: string;
    event_type: string;
    title: string;
  }>;
  currentPrice: number;
}

export function StockChartWithSocial({
  data,
  brandName,
  socialEvents,
  keyEvents,
  currentPrice
}: StockChartWithSocialProps) {
  const [showGoogleTrends, setShowGoogleTrends] = useState(false);
  const [showRedditMentions, setShowRedditMentions] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    name: string;
    date: string;
    price: number;
  } | null>(null);

  return (
    <div>
      {/* Toggle Controls */}
      <div className="mb-4 flex gap-3 flex-wrap">
        <button
          onClick={() => setShowGoogleTrends(!showGoogleTrends)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showGoogleTrends
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 {showGoogleTrends ? 'Hide' : 'Show'} Google Trends
        </button>
        <button
          onClick={() => setShowRedditMentions(!showRedditMentions)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showRedditMentions
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          💬 {showRedditMentions ? 'Hide' : 'Show'} Reddit Buzz
        </button>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          
          {/* X Axis */}
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(parseISO(date), 'MMM yy')}
            stroke="#999"
          />
          
          {/* Left Y Axis - Stock Price */}
          <YAxis
            yAxisId="left"
            stroke="#14b8a6"
            label={{ value: 'Stock Price ($)', angle: -90, position: 'insideLeft' }}
          />
          
          {/* Right Y Axis - Social Metrics */}
          {(showGoogleTrends || showRedditMentions) && (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#a855f7"
              label={{ value: 'Social Signal', angle: 90, position: 'insideRight' }}
            />
          )}
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelFormatter={(date) => format(parseISO(date as string), 'MMM dd, yyyy')}
            formatter={(value: any, name: string) => {
              if (name === 'price') return [`$${value.toFixed(2)}`, 'Stock Price'];
              if (name === 'googleTrends') return [`${value}/100`, 'Search Interest'];
              if (name === 'redditMentions') return [`${value}`, 'Reddit Mentions'];
              return [value, name];
            }}
          />
          
          <Legend />
          
          {/* Stock Price Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={false}
            name={`${brandName} Stock`}
          />
          
          {/* Google Trends Area (optional overlay) */}
          {showGoogleTrends && (
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="googleTrends"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Google Trends"
            />
          )}
          
          {/* Reddit Mentions Line (optional overlay) */}
          {showRedditMentions && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="redditMentions"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: '#f97316', r: 4 }}
              name="Reddit Mentions"
            />
          )}
          
          {/* Social event markers */}
          {socialEvents.map((event) => {
            const dataPoint = data.find((d) => d.date === event.date);
            if (!dataPoint) return null;

            return (
              <ReferenceDot
                key={`social-${event.id}`}
                yAxisId="left"
                x={event.date}
                y={dataPoint.price}
                r={8}
                fill={
                  event.platform === 'tiktok'
                    ? '#a855f7'
                    : event.platform === 'twitter'
                    ? '#3b82f6'
                    : '#ec4899'
                }
                stroke="white"
                strokeWidth={2}
                cursor="pointer"
                onClick={() => setSelectedEvent({
                  name: event.title,
                  date: event.date,
                  price: dataPoint.price
                })}
              />
            );
          })}

          {/* Key event markers */}
          {keyEvents.map((event) => {
            const dataPoint = data.find((d) => d.date === event.date);
            if (!dataPoint) return null;

            return (
              <ReferenceDot
                key={`key-${event.id}`}
                yAxisId="left"
                x={event.date}
                y={dataPoint.price}
                r={10}
                fill="#ef4444"
                stroke="white"
                strokeWidth={2}
                cursor="pointer"
                onClick={() => setSelectedEvent({
                  name: event.title,
                  date: event.date,
                  price: dataPoint.price
                })}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Investment Calculator Tooltip */}
      {selectedEvent && (
        <div className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4">
            <InvestmentCalculatorTooltip
              eventName={selectedEvent.name}
              eventDate={format(parseISO(selectedEvent.date), 'MMM dd, yyyy')}
              priceAtEvent={selectedEvent.price}
              currentPrice={currentPrice}
              onClose={() => setSelectedEvent(null)}
            />
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500" />
          <span className="text-sm text-gray-600">TikTok Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600">Twitter Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-pink-500" />
          <span className="text-sm text-gray-600">Instagram Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600">Key Event</span>
        </div>
        {showGoogleTrends && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 opacity-30" />
            <span className="text-sm text-gray-600">Google Trends</span>
          </div>
        )}
        {showRedditMentions && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600">Reddit Buzz</span>
          </div>
        )}
      </div>
    </div>
  );
}
