import { create } from 'zustand';
import { Goal } from '@/lib/types';

interface GoalState {
  goals: Goal[];
  activeGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
  setGoals: (goals: Goal[]) => void;
  setActiveGoal: (goal: Goal | null) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  activeGoal: null,
  isLoading: false,
  error: null,
  setGoals: (goals) => set({ goals }),
  setActiveGoal: (goal) => set({ activeGoal: goal }),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      activeGoal:
        state.activeGoal?.id === id
          ? { ...state.activeGoal, ...updates }
          : state.activeGoal,
    })),
  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
      activeGoal: state.activeGoal?.id === id ? null : state.activeGoal,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

