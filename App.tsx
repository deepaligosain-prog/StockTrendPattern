import React, { useState } from 'react';
import { StockData, ComparisonData, DiscoveryResult, AppMode, TrendDirection } from './types';
import { analyzeStock, compareStocks, discoverPatterns } from './services/geminiService';
import { StockInput } from './components/StockInput';
import { StockChart } from './components/StockChart';
import { ComparisonView } from './components/ComparisonView';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.SINGLE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Single Analysis
  const [stockData, setStockData] = useState<StockData | null>(null);
  
  // State for Manual Comparison
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

  // State for Discovery (List of comparisons)
  const [discoveryResults, setDiscoveryResults] = useState<ComparisonData[] | null>(null);

  const handleAnalyze = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeStock(ticker);
      setStockData(data);
    } catch (err) {
      setError("Failed to fetch stock data. Please check the ticker or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async (t1: string, t2: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await compareStocks(t1, t2);
      setComparisonData(data);
    } catch (err) {
      setError("Failed to compare stocks. Please check the tickers.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscover = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result: DiscoveryResult = await discoverPatterns();
      setDiscoveryResults(result.pairs);
    } catch (err) {
      setError("Failed to discover patterns. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400 mb-2">
            Stock Correlation Analyzer
          </h1>
          <p className="text-slate-400 text-lg">AI-Powered Technical Analysis & Lead-Lag Detection</p>
        </header>

        {/* Controls */}
        <StockInput 
          onAnalyze={handleAnalyze} 
          onCompare={handleCompare} 
          onDiscover={handleDiscover}
          isLoading={isLoading} 
          mode={mode}
          setMode={(m) => {
            setMode(m);
            setError(null);
            // Clear other modes data when switching to keep UI clean
            if (m === AppMode.SINGLE) { setComparisonData(null); setDiscoveryResults(null); }
            if (m === AppMode.COMPARE) { setStockData(null); setDiscoveryResults(null); }
            if (m === AppMode.DISCOVERY) { setStockData(null); setComparisonData(null); }
          }}
        />

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8 animate-pulse">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}

        {/* SINGLE MODE VIEW */}
        {mode === AppMode.SINGLE && stockData && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            
            {/* Main Price Card */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-9xl">
                📈
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h2 className="text-3xl font-bold text-white">{stockData.ticker}</h2>
                  <p className="text-slate-400">{stockData.companyName}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-mono font-semibold text-white">${stockData.currentPrice.toFixed(2)}</div>
                  <div className={`text-sm font-medium ${stockData.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-slate-950/50 rounded-xl border border-slate-800/50 p-4 mb-4">
                 <StockChart data={stockData.history} color="#818cf8" showSMA={true} />
              </div>
              
              <div className="flex gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-400"></span> Price
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span> 5-Day SMA
                </div>
              </div>
            </div>

            {/* Analysis Side Panel */}
            <div className="flex flex-col gap-6">
              {/* Trend Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-center items-center text-center">
                 <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-3">Market Sentiment</h3>
                 <div className="mb-4 transform scale-125">{renderTrendBadge(stockData.trend)}</div>
                 <p className="text-slate-300 italic">"{stockData.trendReasoning}"</p>
              </div>

               {/* Stats Card */}
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                 <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-4">Technical Indicators</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Current SMA (5)</span>
                      <span className="font-mono text-amber-400">${stockData.sma5Current.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Signal</span>
                      <span className="font-medium text-white">
                        {stockData.currentPrice > stockData.sma5Current ? 'Above SMA' : 'Below SMA'}
                      </span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* COMPARISON VIEW (Manual) */}
        {mode === AppMode.COMPARE && comparisonData && !isLoading && (
          <ComparisonView data={comparisonData} />
        )}

        {/* DISCOVERY VIEW (List) */}
        {mode === AppMode.DISCOVERY && discoveryResults && !isLoading && (
          <div className="space-y-8">
            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4 mb-8 text-center">
                <h2 className="text-xl font-semibold text-emerald-400">Discovery Results</h2>
                <p className="text-slate-400 text-sm mt-1">Found {discoveryResults.length} pairs with strong predictive signals</p>
            </div>
            {discoveryResults.map((result, index) => (
                <ComparisonView key={index} data={result} rank={index + 1} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}