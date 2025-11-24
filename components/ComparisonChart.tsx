import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { StockData } from '../types';

interface ComparisonChartProps {
  stock1: StockData;
  stock2: StockData;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ stock1, stock2 }) => {
  // Merge data based on index (assuming aligned dates from API)
  const mergedData = stock1.history.map((point, index) => ({
    date: point.date,
    price1: point.price,
    price2: stock2.history[index]?.price || 0,
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            tickLine={false}
            axisLine={false}
            minTickGap={30}
            tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: '#818cf8', fontSize: 11 }} // Indigo
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#c084fc', fontSize: 11 }} // Purple
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            labelStyle={{ color: '#94a3b8' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price1"
            stroke="#818cf8"
            strokeWidth={2}
            dot={false}
            name={stock1.ticker}
            animationDuration={1500}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="price2"
            stroke="#c084fc"
            strokeWidth={2}
            dot={false}
            name={stock2.ticker}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};