import { apiClient } from "./client";
import {
  ExchangeAccount,
  MarketPair,
  PortfolioStats,
  ApiResponse,
} from "@/lib/types";

export const exchangeApi = {
  // Get exchange account and balances
  getBalance: async (): Promise<ExchangeAccount> => {
    const response = await apiClient<ApiResponse<ExchangeAccount>>(
      "/exchange/balance"
    );
    if (!response.success || !response.data) {
      throw new Error("Failed to fetch balance");
    }
    return response.data;
  },

  // Get market pairs (BTC/USDT, ETH/USDT)
  getMarketPairs: async (): Promise<MarketPair[]> => {
    const response = await apiClient<ApiResponse<MarketPair[]>>(
      "/market/pairs"
    );
    if (!response.success || !response.data) {
      throw new Error("Failed to fetch market pairs");
    }
    return response.data;
  },

  // Get specific market pair
  getMarketPair: async (symbol: string): Promise<MarketPair> => {
    const response = await apiClient<ApiResponse<MarketPair>>(
      `/market/pairs/${symbol}`
    );
    if (!response.success || !response.data) {
      throw new Error("Failed to fetch market pair");
    }
    return response.data;
  },

  // Get portfolio statistics
  getPortfolioStats: async (): Promise<PortfolioStats> => {
    const response = await apiClient<ApiResponse<PortfolioStats>>(
      "/exchange/portfolio/stats"
    );
    if (!response.success || !response.data) {
      throw new Error("Failed to fetch portfolio stats");
    }
    return response.data;
  },
};
