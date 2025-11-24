import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';
import { HistoricalPoint } from '../types';

interface StockChartProps {
  data: HistoricalPoint[];
  color: string;
  showSMA?: boolean;
}

export const StockChart: React.FC<StockChartProps> = ({ data, color, showSMA = false }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            tickLine={false}
            axisLine={false}
            minTickGap={30}
            tickFormatter={(value) => {
                const date = new Date(value);
                // Show "Jan 23" format for longer ranges
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }}
          />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            labelStyle={{ color: '#94a3b8' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill={`url(#colorGradient-${color})`}
            animationDuration={1500}
          />
          {showSMA && (
            <Line
              type="monotone"
              dataKey="sma5"
              stroke="#fbbf24" // Amber 400
              strokeWidth={2}
              dot={false}
              name="5-Day SMA"
              animationDuration={1500}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};