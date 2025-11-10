import { apiClient } from './client';
import {
  Order,
  Trade,
  BalanceHistory,
  TradeHistoryFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/lib/types';

export const tradeApi = {
  // Get order history with optional filters
  getOrders: async (
    filters?: TradeHistoryFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.startDate && { startDate: filters.startDate }),
      ...(filters?.endDate && { endDate: filters.endDate }),
      ...(filters?.asset && { asset: filters.asset }),
      ...(filters?.status && { status: filters.status }),
    });

    const response = await apiClient<ApiResponse<PaginatedResponse<Order>>>(
      `/history/orders?${params}`
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch orders');
    }
    return response.data;
  },

  // Get a single order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient<ApiResponse<Order>>(
      `/history/orders/${id}`
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch order');
    }
    return response.data;
  },

  // Get trade history with optional filters
  getTrades: async (
    filters?: TradeHistoryFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Trade>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.startDate && { startDate: filters.startDate }),
      ...(filters?.endDate && { endDate: filters.endDate }),
      ...(filters?.asset && { asset: filters.asset }),
      ...(filters?.side && { side: filters.side }),
    });

    const response = await apiClient<ApiResponse<PaginatedResponse<Trade>>>(
      `/history/trades?${params}`
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch trades');
    }
    return response.data;
  },

  // Get balance history
  getBalanceHistory: async (
    startDate?: string,
    endDate?: string
  ): Promise<BalanceHistory[]> => {
    const params = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const response = await apiClient<ApiResponse<BalanceHistory[]>>(
      `/history/balance?${params}`
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch balance history');
    }
    return response.data;
  },
};

