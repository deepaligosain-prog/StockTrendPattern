import React from 'react';
import { ComparisonData, TrendDirection } from '../types';
import { ComparisonChart } from './ComparisonChart';
import { CorrelationMeter } from './CorrelationMeter';
import { LagAnalysisCard } from './LagAnalysisCard';

interface ComparisonViewProps {
  data: ComparisonData;
  rank?: number;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ data, rank }) => {
  const renderTrendBadge = (trend: TrendDirection) => {
    switch (trend) {
      case TrendDirection.BULLISH:
        return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm font-medium">📈 Bullish</span>;
      case TrendDirection.BEARISH:
        return <span className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full text-sm font-medium">📉 Bearish</span>;
      default:
        return <span className="flex items-center gap-1 text-slate-400 bg-slate-400/10 px-3 py-1 rounded-full text-sm font-medium">➖ Neutral</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up mb-12 border-b border-slate-800/50 pb-12 last:border-0 last:pb-0">
      
      {/* Comparison Main */}
      <div className="md:col-span-3 space-y-6">
        
        {/* Rank Header if provided */}
        {rank && (
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded border border-emerald-500/30 uppercase tracking-wider">
              Match #{rank}
            </span>
          </div>
        )}

        {/* Lead-Lag Alert Card (if detected) */}
        {data.leadLagAnalysis?.detected && (
           <LagAnalysisCard analysis={data.leadLagAnalysis} />
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex gap-2">
              <span className="text-indigo-400">{data.stock1.ticker}</span> 
              <span className="text-slate-600">vs</span>
              <span className="text-purple-400">{data.stock2.ticker}</span>
            </h2>
          </div>
          <div className="bg-slate-950/50 rounded-xl border border-slate-800/50 p-4">
            <ComparisonChart stock1={data.stock1} stock2={data.stock2} />
          </div>
        </div>

         {/* Comparison Summary Text */}
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <span className="text-xl mt-1">ℹ️</span>
              <div>
                <h3 className="text-slate-100 font-semibold mb-2">AI Analysis</h3>
                <p className="text-slate-400 leading-relaxed">{data.comparisonSummary}</p>
              </div>
            </div>
         </div>
      </div>

      {/* Comparison Stats Sidebar */}
      <div className="md:col-span-1 space-y-6">
        
        {/* Correlation */}
        <CorrelationMeter correlation={data.correlation} />

        {/* Stock 1 Mini Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-indigo-400 text-lg">{data.stock1.ticker}</h3>
            {renderTrendBadge(data.stock1.trend)}
          </div>
          <div className="text-2xl font-mono font-semibold text-white">${data.stock1.currentPrice.toFixed(2)}</div>
        </div>

        {/* Stock 2 Mini Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-purple-400 text-lg">{data.stock2.ticker}</h3>
            {renderTrendBadge(data.stock2.trend)}
          </div>
          <div className="text-2xl font-mono font-semibold text-white">${data.stock2.currentPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};