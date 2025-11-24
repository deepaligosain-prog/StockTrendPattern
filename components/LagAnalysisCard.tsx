import React from 'react';
import { LeadLagAnalysis } from '../types';

interface LagAnalysisCardProps {
  analysis: LeadLagAnalysis;
}

export const LagAnalysisCard: React.FC<LagAnalysisCardProps> = ({ analysis }) => {
  if (!analysis || !analysis.detected) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden mb-6 animate-fade-in-up">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-9xl">
        ⏱️
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg border border-emerald-500/30">
            <span className="text-xl">📈</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Lagged Signal Detected</h3>
            <p className="text-slate-400 text-sm">Strong predictive relationship found</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-950/60 rounded-xl p-4 border border-indigo-500/20 backdrop-blur-sm">
            <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-1">Leading Asset</div>
            <div className="text-2xl font-bold text-white tracking-tight">{analysis.leaderTicker}</div>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-4 border border-indigo-500/20 backdrop-blur-sm">
            <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-1">Lag Time</div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">{analysis.lagDays} Days</div>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-4 border border-indigo-500/20 backdrop-blur-sm">
            <div className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-1">Correlation @ Lag</div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{analysis.correlation.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 flex gap-3">
          <span className="text-xl">ℹ️</span>
          <p className="text-slate-300 text-sm leading-relaxed">
            {analysis.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};