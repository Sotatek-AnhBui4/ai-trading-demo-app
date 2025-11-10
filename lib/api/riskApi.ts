import { apiClient } from './client';
import { RiskConfig, ApiResponse } from '@/lib/types';

export const riskApi = {
  // Get all risk configurations
  getConfigs: async (): Promise<RiskConfig[]> => {
    const response = await apiClient<ApiResponse<RiskConfig[]>>('/risk/config');
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch risk configurations');
    }
    return response.data;
  },

  // Get a single risk configuration by ID
  getConfig: async (id: string): Promise<RiskConfig> => {
    const response = await apiClient<ApiResponse<RiskConfig>>(
      `/risk/config/${id}`
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch risk configuration');
    }
    return response.data;
  },

  // Create a new risk configuration
  createConfig: async (config: Omit<RiskConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<RiskConfig> => {
    const response = await apiClient<ApiResponse<RiskConfig>>('/risk/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
    if (!response.success || !response.data) {
      throw new Error('Failed to create risk configuration');
    }
    return response.data;
  },

  // Update a risk configuration
  updateConfig: async (
    id: string,
    updates: Partial<RiskConfig>
  ): Promise<RiskConfig> => {
    const response = await apiClient<ApiResponse<RiskConfig>>(
      `/risk/config/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to update risk configuration');
    }
    return response.data;
  },

  // Delete a risk configuration
  deleteConfig: async (id: string): Promise<void> => {
    const response = await apiClient<ApiResponse<void>>(
      `/risk/config/${id}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.success) {
      throw new Error('Failed to delete risk configuration');
    }
  },
};

