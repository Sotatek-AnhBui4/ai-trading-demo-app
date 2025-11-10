import { create } from "zustand";
import { ExchangeAccount, MarketPair, PortfolioStats } from "@/lib/types";

interface ExchangeState {
  account: ExchangeAccount | null;
  marketPairs: MarketPair[];
  portfolioStats: PortfolioStats | null;
  isLoading: boolean;
  error: string | null;
  setAccount: (account: ExchangeAccount | null) => void;
  setMarketPairs: (pairs: MarketPair[]) => void;
  updateMarketPair: (symbol: string, updates: Partial<MarketPair>) => void;
  setPortfolioStats: (stats: PortfolioStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useExchangeStore = create<ExchangeState>((set) => ({
  account: null,
  marketPairs: [],
  portfolioStats: null,
  isLoading: false,
  error: null,
  setAccount: (account) => set({ account }),
  setMarketPairs: (pairs) => set({ marketPairs: pairs }),
  updateMarketPair: (symbol, updates) =>
    set((state) => ({
      marketPairs: state.marketPairs.map((p) =>
        p.symbol === symbol ? { ...p, ...updates } : p
      ),
    })),
  setPortfolioStats: (stats) => set({ portfolioStats: stats }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
