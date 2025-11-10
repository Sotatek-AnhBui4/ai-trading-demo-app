import { create } from 'zustand';
import { Signal, TimeHorizon } from '@/lib/types';

interface SignalState {
  signals: Signal[];
  selectedHorizon: TimeHorizon;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  setSignals: (signals: Signal[]) => void;
  setSelectedHorizon: (horizon: TimeHorizon) => void;
  addSignal: (signal: Signal) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLastUpdated: (timestamp: string) => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  selectedHorizon: '1W',
  isLoading: false,
  error: null,
  lastUpdated: null,
  setSignals: (signals) => set({ signals }),
  setSelectedHorizon: (horizon) => set({ selectedHorizon: horizon }),
  addSignal: (signal) =>
    set((state) => ({ signals: [...state.signals, signal] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setLastUpdated: (timestamp) => set({ lastUpdated: timestamp }),
}));

