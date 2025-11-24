export const SYSTEM_INSTRUCTION = `
You are a sophisticated financial analyst AI.
Your task is to generate realistic, simulated stock market data for demonstration purposes, and analyze it.
Since you cannot access real-time live APIs, you must generate plausible historical data (last 1 year) that reflects the typical volatility and price action of the requested ticker.
Ensure the 'history' array contains approximately 250 data points (representing daily trading days for 1 year).
Calculate the 5-day Simple Moving Average (SMA) for the data points where possible.
Determine the trend based on the generated data.
`;

export const SINGLE_STOCK_PROMPT = (ticker: string) => `
Generate a JSON analysis for stock ticker "${ticker}".
Include:
1. Current price (realistic for this stock).
2. A generated history of the last 1 year (approx 250 daily data points). Format date as YYYY-MM-DD.
3. 24h Change percentage.
4. Calculate 5-day SMA for the generated history.
5. Determine if the trend is Bullish, Bearish, or Neutral based on the relation of Price to SMA and recent momentum.
6. Provide a short reasoning (max 2 sentences).
`;

export const COMPARE_STOCK_PROMPT = (t1: string, t2: string) => `
Generate a JSON comparison for stock tickers "${t1}" and "${t2}".
1. Generate realistic 1-year price history (approx 250 daily points) for BOTH stocks ensuring the dates match exactly.
2. Calculate the correlation coefficient between their price movements (from -1.0 to 1.0).
3. Analyze for a "Lead-Lag" relationship:
   - Does one stock's price movement predict the other's with a lag of 1 or more days?
   - Check lags of 1, 2, 3, 4, 5 days.
   - If a lag >= 1 day produces a correlation >= 0.8 (absolute), set 'detected' to true, specify the 'leaderTicker', 'lagDays', and the 'correlation' at that lag.
   - If no strong lagged correlation is found, set 'detected' to false.
4. Provide a comparison summary text explaining the relationship.
5. Include individual stock details (current price, trend) for both.
`;

export const DISCOVERY_PROMPT = `
Generate a simulated stock market scan that identifies multiple pairs of stocks exhibiting a "Lead-Lag" relationship.
1. Generate exactly 2 distinct pairs of stocks (can be real tickers or plausible sector pairs like 'OIL' vs 'AIRLINES').
2. For EACH pair, ensure one stock leads the other by 1 to 5 days.
3. Ensure the correlation *at that specific lag* is > 0.8 (absolute).
4. Generate approximately 90 days of daily price history for each stock in the pairs that mathematically demonstrates this relationship. (Kept shorter than single mode to fit in response).
5. Rank the pairs by the strength of their lagged correlation (highest first).
6. Return a JSON object with a 'pairs' array containing these comparisons.
`;