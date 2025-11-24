import React, { useState } from 'react';
import { StockInputProps, AppMode } from '../types';

export const StockInput: React.FC<StockInputProps> = ({ onAnalyze, onCompare, onDiscover, isLoading, mode, setMode }) => {
  const [ticker1, setTicker1] = useState('');
  const [ticker2, setTicker2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === AppMode.SINGLE && ticker1) {
      onAnalyze(ticker1);
    } else if (mode === AppMode.COMPARE && ticker1 && ticker2) {
      onCompare(ticker1, ticker2);
    } else if (mode === AppMode.DISCOVERY) {
      onDiscover();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          {mode === AppMode.DISCOVERY ? <span className="text-xl">🧭</span> : <span className="text-xl">📈</span>}
          {mode === AppMode.DISCOVERY ? 'Pattern Discovery' : 'Market Analyzer'}
        </h2>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setMode(AppMode.SINGLE)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
              mode === AppMode.SINGLE ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Single
          </button>
          <button
            onClick={() => setMode(AppMode.COMPARE)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
              mode === AppMode.COMPARE ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setMode(AppMode.DISCOVERY)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
              mode === AppMode.DISCOVERY ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Discover Lag
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        {mode !== AppMode.DISCOVERY && (
          <div className="relative flex-1 group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg leading-none">🔍</span>
            <input
              type="text"
              value={ticker1}
              onChange={(e) => setTicker1(e.target.value.toUpperCase())}
              placeholder={mode === AppMode.SINGLE ? "Enter Stock Ticker (e.g. AAPL)" : "First Ticker (e.g. NVDA)"}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>
        )}

        {mode === AppMode.COMPARE && (
          <div className="relative flex-1 group">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg leading-none">🔍</span>
            <input
              type="text"
              value={ticker2}
              onChange={(e) => setTicker2(e.target.value.toUpperCase())}
              placeholder="Second Ticker (e.g. AMD)"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600"
            />
          </div>
        )}

        {mode === AppMode.DISCOVERY && (
            <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex items-center text-slate-400 text-sm">
                <span className="mr-2 text-lg">🧭</span>
                AI will scan for pairs where one stock follows another with >0.8 correlation and >1 day lag.
            </div>
        )}

        <button
          type="submit"
          disabled={isLoading || (mode !== AppMode.DISCOVERY && !ticker1) || (mode === AppMode.COMPARE && !ticker2)}
          className={`
            text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2
            ${mode === AppMode.DISCOVERY 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/20'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : mode === AppMode.COMPARE ? (
            <>Compare ↔️</>
          ) : mode === AppMode.DISCOVERY ? (
            <>Scan Market 🧭</>
          ) : (
            'Analyze Trend'
          )}
        </button>
      </form>
    </div>
  );
};