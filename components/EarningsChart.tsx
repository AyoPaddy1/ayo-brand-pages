'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

interface EarningsDataPoint {
  quarter: string;
  estimated: number;
  actual: number | null; // null for future quarters
}

interface EarningsChartProps {
  ticker: string;
  brandName: string;
}

export function EarningsChart({ ticker, brandName }: EarningsChartProps) {
  // Mock earnings data - in production, this would come from an API
  const earningsData: EarningsDataPoint[] = [
    { quarter: 'Q4 FY24', estimated: 0.85, actual: 0.99 },
    { quarter: 'Q1 FY25', estimated: 0.70, actual: 0.70 },
    { quarter: 'Q2 FY25', estimated: 0.65, actual: 0.68 },
    { quarter: 'Q3 FY25', estimated: 0.55, actual: 0.60 },
    { quarter: 'Q4 FY25', estimated: 0.40, actual: 0.25 },
    { quarter: 'Q1 FY26', estimated: 0.45, actual: 0.55 },
    { quarter: 'Q2 FY26', estimated: 0.50, actual: 0.38 },
    { quarter: 'Q3 FY26', estimated: 0.37, actual: null }, // Future
  ];

  // Calculate the narrative
  const latestActual = earningsData.filter(d => d.actual !== null).slice(-1)[0];
  const firstActual = earningsData.filter(d => d.actual !== null)[0];
  const percentChange = ((latestActual.actual! - firstActual.actual!) / firstActual.actual!) * 100;

  const getNarrative = () => {
    if (percentChange < -50) {
      return {
        summary: `Earnings dropped ${Math.abs(percentChange).toFixed(0)}% over 18 months—here's why`,
        context: `${brandName} went from $${firstActual.actual?.toFixed(2)}/share to $${latestActual.actual?.toFixed(2)}/share. The main culprit? Inventory piled up as demand slowed. They're cutting back on production and focusing on direct-to-consumer sales to rebuild margins.`,
        keyMoment: 'Q4 FY25',
        keyMomentDescription: 'This is when inventory started piling up',
      };
    } else if (percentChange > 20) {
      return {
        summary: `Earnings up ${percentChange.toFixed(0)}% over 18 months—momentum building`,
        context: `${brandName} is on a roll. From $${firstActual.actual?.toFixed(2)}/share to $${latestActual.actual?.toFixed(2)}/share. Digital sales are growing faster than expected, and cost-cutting is paying off.`,
        keyMoment: 'Q1 FY26',
        keyMomentDescription: 'Turnaround started here',
      };
    } else {
      return {
        summary: `Earnings relatively flat—${brandName} is stabilizing`,
        context: `After a rough patch, ${brandName} is finding its footing. Earnings are hovering around $${latestActual.actual?.toFixed(2)}/share. Not growing fast, but not collapsing either.`,
        keyMoment: 'Q3 FY25',
        keyMomentDescription: 'Stabilization began',
      };
    }
  };

  const narrative = getNarrative();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header with Narrative */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          📊 {brandName} Earnings
        </h2>
        <div className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              A
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{narrative.summary}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {narrative.context}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={earningsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="quarter"
            stroke="#999"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#999"
            tick={{ fontSize: 12 }}
            label={{ value: 'EPS ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value: any, name: string) => {
              if (name === 'estimated') return [`$${value.toFixed(2)}`, 'Estimated'];
              if (name === 'actual') return [`$${value.toFixed(2)}`, 'Actual'];
              return [value, name];
            }}
          />
          <Legend />
          
          {/* Estimated Line */}
          <Line
            type="monotone"
            dataKey="estimated"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#9ca3af', r: 4 }}
            name="Estimated"
          />
          
          {/* Actual Line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{ fill: '#14b8a6', r: 5 }}
            name="Actual"
            connectNulls={false}
          />

          {/* Key Moment Marker */}
          {narrative.keyMoment && (
            <ReferenceDot
              x={narrative.keyMoment}
              y={earningsData.find(d => d.quarter === narrative.keyMoment)?.actual || 0}
              r={8}
              fill="#ef4444"
              stroke="white"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Key Moment Callout */}
      {narrative.keyMoment && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="font-medium">{narrative.keyMoment}:</span>
          <span>{narrative.keyMomentDescription}</span>
        </div>
      )}

      {/* Next Earnings */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Next Earnings</div>
            <div className="font-bold text-gray-900">Q3 FY26</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Estimated</div>
            <div className="font-bold text-gray-900">$0.37 per share</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Date</div>
            <div className="font-bold text-teal-600">Dec 18, After Hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
