import { useEffect, useState } from 'react';
import { getProfile } from '../services/authService';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cba_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        localStorage.removeItem('cba_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token]);

  return { user, token, loading, setToken, setUser };
}
