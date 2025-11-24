import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StockData, ComparisonData, DiscoveryResult, TrendDirection } from '../types';
import { SYSTEM_INSTRUCTION, SINGLE_STOCK_PROMPT, COMPARE_STOCK_PROMPT, DISCOVERY_PROMPT } from '../constants';

const ai = new GoogleGenAI({ apiKey: "AIzaSyBg_9PAJniN1c9LN3yJXCFUCtgjxntyQYI" });

const stockSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ticker: { type: Type.STRING },
    companyName: { type: Type.STRING },
    currentPrice: { type: Type.NUMBER },
    changePercent: { type: Type.NUMBER },
    sma5Current: { type: Type.NUMBER },
    trend: { type: Type.STRING, enum: [TrendDirection.BULLISH, TrendDirection.BEARISH, TrendDirection.NEUTRAL] },
    trendReasoning: { type: Type.STRING },
    history: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          price: { type: Type.NUMBER },
          sma5: { type: Type.NUMBER },
        },
        required: ["date", "price"],
      },
    },
  },
  required: ["ticker", "companyName", "currentPrice", "changePercent", "history", "trend", "trendReasoning", "sma5Current"],
};

const comparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stock1: stockSchema,
    stock2: stockSchema,
    correlation: { type: Type.NUMBER },
    comparisonSummary: { type: Type.STRING },
    leadLagAnalysis: {
      type: Type.OBJECT,
      properties: {
        detected: { type: Type.BOOLEAN },
        leaderTicker: { type: Type.STRING },
        lagDays: { type: Type.NUMBER },
        correlation: { type: Type.NUMBER },
        explanation: { type: Type.STRING },
      },
      required: ["detected", "leaderTicker", "lagDays", "correlation", "explanation"],
    },
  },
  required: ["stock1", "stock2", "correlation", "comparisonSummary", "leadLagAnalysis"],
};

const discoverySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    pairs: {
      type: Type.ARRAY,
      items: comparisonSchema
    }
  },
  required: ["pairs"]
};

export const analyzeStock = async (ticker: string): Promise<StockData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: SINGLE_STOCK_PROMPT(ticker),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: stockSchema,
        temperature: 0.3, 
      },
    });

    const data = JSON.parse(response.text);
    return data as StockData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze stock data.");
  }
};

export const compareStocks = async (ticker1: string, ticker2: string): Promise<ComparisonData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: COMPARE_STOCK_PROMPT(ticker1, ticker2),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: comparisonSchema,
        temperature: 0.3,
      },
    });

    const data = JSON.parse(response.text);
    return data as ComparisonData;
  } catch (error) {
    console.error("Gemini Comparison Error:", error);
    throw new Error("Failed to compare stocks.");
  }
};

export const discoverPatterns = async (): Promise<DiscoveryResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: DISCOVERY_PROMPT,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: discoverySchema,
        temperature: 0.7, 
      },
    });

    const data = JSON.parse(response.text);
    return data as DiscoveryResult;
  } catch (error) {
    console.error("Gemini Discovery Error:", error);
    throw new Error("Failed to discover patterns.");
  }
};
