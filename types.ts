export enum TrendDirection {
  BULLISH = 'Bullish',
  BEARISH = 'Bearish',
  NEUTRAL = 'Neutral',
}

export interface HistoricalPoint {
  date: string;
  price: number;
  sma5?: number;
}

export interface StockData {
  ticker: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  history: HistoricalPoint[];
  trend: TrendDirection;
  trendReasoning: string;
  sma5Current: number;
}

export interface LeadLagAnalysis {
  detected: boolean;
  leaderTicker: string;
  lagDays: number;
  correlation: number;
  explanation: string;
}

export interface ComparisonData {
  stock1: StockData;
  stock2: StockData;
  correlation: number; // -1 to 1
  comparisonSummary: string;
  leadLagAnalysis?: LeadLagAnalysis;
}

export interface DiscoveryResult {
  pairs: ComparisonData[];
}

export enum AppMode {
  SINGLE = 'SINGLE',
  COMPARE = 'COMPARE',
  DISCOVERY = 'DISCOVERY',
}

export interface StockInputProps {
  onAnalyze: (ticker: string) => void;
  onCompare: (ticker1: string, ticker2: string) => void;
  onDiscover: () => void;
  isLoading: boolean;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}