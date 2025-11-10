import { useEffect } from 'react';
import { useUserStore } from '@/lib/stores/useUserStore';
import { userApi } from '@/lib/api';

export function useUserData() {
  const { user, setUser, setLoading, setError } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await userApi.getProfile();
        setUser(userData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch user');
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, setLoading, setError]);

  return { user };
}

