import { create } from 'zustand';
import { RiskConfig } from '@/lib/types';

interface RiskState {
  configs: RiskConfig[];
  activeConfig: RiskConfig | null;
  isLoading: boolean;
  error: string | null;
  setConfigs: (configs: RiskConfig[]) => void;
  setActiveConfig: (config: RiskConfig | null) => void;
  addConfig: (config: RiskConfig) => void;
  updateConfig: (id: string, config: Partial<RiskConfig>) => void;
  deleteConfig: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  configs: [],
  activeConfig: null,
  isLoading: false,
  error: null,
  setConfigs: (configs) => set({ configs }),
  setActiveConfig: (config) => set({ activeConfig: config }),
  addConfig: (config) =>
    set((state) => ({ configs: [...state.configs, config] })),
  updateConfig: (id, updates) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      activeConfig:
        state.activeConfig?.id === id
          ? { ...state.activeConfig, ...updates }
          : state.activeConfig,
    })),
  deleteConfig: (id) =>
    set((state) => ({
      configs: state.configs.filter((c) => c.id !== id),
      activeConfig: state.activeConfig?.id === id ? null : state.activeConfig,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

