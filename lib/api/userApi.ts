import { apiClient } from './client';
import { UserProfile, ApiResponse } from '@/lib/types';

export const userApi = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient<ApiResponse<UserProfile>>('/user/profile');
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch user profile');
    }
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    updates: Partial<UserProfile>
  ): Promise<UserProfile> => {
    const response = await apiClient<ApiResponse<UserProfile>>(
      '/user/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to update user profile');
    }
    return response.data;
  },
};

