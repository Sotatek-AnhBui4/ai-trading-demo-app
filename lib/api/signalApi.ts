import { apiClient } from './client';
import { Signal, TimeHorizon, ApiResponse } from '@/lib/types';

export const signalApi = {
  // Get all signals with optional horizon filter
  getSignals: async (horizon?: TimeHorizon): Promise<Signal[]> => {
    const params = horizon ? `?horizon=${horizon}` : '';
    const response = await apiClient<ApiResponse<Signal[]>>(
      `/signals${params}`
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch signals');
    }
    return response.data;
  },

  // Get signal for a specific asset
  getSignalByAsset: async (
    asset: string,
    horizon?: TimeHorizon
  ): Promise<Signal> => {
    const params = horizon ? `?horizon=${horizon}` : '';
    const response = await apiClient<ApiResponse<Signal>>(
      `/signals/${asset}${params}`
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch signal');
    }
    return response.data;
  },
};

