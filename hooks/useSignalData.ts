import { useEffect } from 'react';
import { useSignalStore } from '@/lib/stores/useSignalStore';
import { signalApi } from '@/lib/api';

export function useSignalData() {
  const {
    signals,
    selectedHorizon,
    setSignals,
    setLoading,
    setError,
    setLastUpdated,
  } = useSignalStore();

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await signalApi.getSignals(selectedHorizon);
        setSignals(data);
        setLastUpdated(new Date().toISOString());
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch signals');
        console.error('Failed to fetch signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, [selectedHorizon, setSignals, setLoading, setError, setLastUpdated]);

  return { signals };
}

