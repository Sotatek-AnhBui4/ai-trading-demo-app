import { useEffect } from 'react';
import { useExchangeStore } from '@/lib/stores/useExchangeStore';
import { useGoalStore } from '@/lib/stores/useGoalStore';
import { useHistoryStore } from '@/lib/stores/useHistoryStore';
import { exchangeApi, goalApi, tradeApi } from '@/lib/api';

export function useDashboardData() {
  const {
    setAccount,
    setMarketPairs,
    setPortfolioStats,
    setLoading: setExchangeLoading,
    setError: setExchangeError,
  } = useExchangeStore();

  const {
    setGoals,
    setLoading: setGoalsLoading,
    setError: setGoalsError,
  } = useGoalStore();

  const {
    setBalanceHistory,
    setLoading: setHistoryLoading,
    setError: setHistoryError,
  } = useHistoryStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch exchange data
      try {
        setExchangeLoading(true);
        setExchangeError(null);
        const [account, pairs, stats] = await Promise.all([
          exchangeApi.getBalance(),
          exchangeApi.getMarketPairs(),
          exchangeApi.getPortfolioStats(),
        ]);
        setAccount(account);
        setMarketPairs(pairs);
        setPortfolioStats(stats);
      } catch (error) {
        setExchangeError(
          error instanceof Error ? error.message : 'Failed to fetch exchange data'
        );
        console.error('Failed to fetch exchange data:', error);
      } finally {
        setExchangeLoading(false);
      }

      // Fetch goals
      try {
        setGoalsLoading(true);
        setGoalsError(null);
        const goals = await goalApi.getGoals();
        setGoals(goals);
      } catch (error) {
        setGoalsError(
          error instanceof Error ? error.message : 'Failed to fetch goals'
        );
        console.error('Failed to fetch goals:', error);
      } finally {
        setGoalsLoading(false);
      }

      // Fetch balance history
      try {
        setHistoryLoading(true);
        setHistoryError(null);
        const history = await tradeApi.getBalanceHistory();
        setBalanceHistory(history);
      } catch (error) {
        setHistoryError(
          error instanceof Error ? error.message : 'Failed to fetch balance history'
        );
        console.error('Failed to fetch balance history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty deps - fetch once on mount

  return {};
}

