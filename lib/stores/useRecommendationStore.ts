import { create } from 'zustand';
import { AIRecommendation } from '@/lib/types';

interface RecommendationState {
  recommendations: AIRecommendation[];
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
  
  // Actions
  addRecommendation: (recommendation: AIRecommendation) => void;
  setRecommendations: (recommendations: AIRecommendation[]) => void;
  updateRecommendationStatus: (id: string, status: 'approved' | 'rejected' | 'executed') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLastFetched: (timestamp: string) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  
  addRecommendation: (recommendation) =>
    set((state) => ({
      recommendations: [recommendation, ...state.recommendations], // Newest first
    })),
  
  setRecommendations: (recommendations) => 
    set({ recommendations }),
  
  updateRecommendationStatus: (id, status) =>
    set((state) => ({
      recommendations: state.recommendations.map((rec) =>
        rec.id === id ? { ...rec, status } : rec
      ),
    })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setLastFetched: (timestamp) => set({ lastFetched: timestamp }),
}));

