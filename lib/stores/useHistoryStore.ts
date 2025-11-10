import { create } from 'zustand';
import { Order, Trade, BalanceHistory, TradeHistoryFilters } from '@/lib/types';

interface HistoryState {
  orders: Order[];
  trades: Trade[];
  balanceHistory: BalanceHistory[];
  filters: TradeHistoryFilters;
  isLoading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  setTrades: (trades: Trade[]) => void;
  setBalanceHistory: (history: BalanceHistory[]) => void;
  setFilters: (filters: Partial<TradeHistoryFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  orders: [],
  trades: [],
  balanceHistory: [],
  filters: {},
  isLoading: false,
  error: null,
  setOrders: (orders) => set({ orders }),
  setTrades: (trades) => set({ trades }),
  setBalanceHistory: (history) => set({ balanceHistory: history }),
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  clearFilters: () => set({ filters: {} }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

