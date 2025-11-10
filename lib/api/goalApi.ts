import { apiClient } from './client';
import { Goal, ApiResponse } from '@/lib/types';

interface CreateGoalRequest {
  capital_usd: number;
  target_return_pct: number;
  horizon_days: number;
  risk_profile: string;
  constraints: {
    spot_only: boolean;
    max_asset_weight_pct: number;
    max_drawdown_pct: number;
    max_daily_var_pct: number;
    blacklist: string[];
    whitelist?: string[];
  };
}

export const goalApi = {
  // Get all goals
  getGoals: async (): Promise<Goal[]> => {
    const response = await apiClient<ApiResponse<Goal[]>>('/goals');
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch goals');
    }
    return response.data;
  },

  // Get a single goal by ID
  getGoal: async (id: string): Promise<Goal> => {
    const response = await apiClient<ApiResponse<Goal>>(`/goals/${id}`);
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch goal');
    }
    return response.data;
  },

  // Create a new goal
  createGoal: async (request: CreateGoalRequest): Promise<Goal> => {
    const response = await apiClient<ApiResponse<Goal>>('/goals', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (!response.success || !response.data) {
      throw new Error('Failed to create goal');
    }
    return response.data;
  },

  // Update a goal
  updateGoal: async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    const response = await apiClient<ApiResponse<Goal>>(`/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (!response.success || !response.data) {
      throw new Error('Failed to update goal');
    }
    return response.data;
  },

  // Execute a goal plan
  executeGoal: async (id: string, dryRun: boolean = false): Promise<Goal> => {
    const response = await apiClient<ApiResponse<Goal>>(
      `/goals/${id}/execute`,
      {
        method: 'POST',
        body: JSON.stringify({ dry_run: dryRun, confirm_changes: true }),
      }
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to execute goal');
    }
    return response.data;
  },

  // Cancel/pause a goal
  pauseGoal: async (id: string): Promise<Goal> => {
    const response = await apiClient<ApiResponse<Goal>>(`/goals/${id}/pause`, {
      method: 'POST',
    });
    if (!response.success || !response.data) {
      throw new Error('Failed to pause goal');
    }
    return response.data;
  },

  // Delete a goal
  deleteGoal: async (id: string): Promise<void> => {
    const response = await apiClient<ApiResponse<void>>(`/goals/${id}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new Error('Failed to delete goal');
    }
  },
};

