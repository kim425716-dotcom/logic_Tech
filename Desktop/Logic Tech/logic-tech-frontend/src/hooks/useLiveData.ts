import { useCallback, useEffect, useRef, useState } from 'react';

interface UseLiveDataOptions {
  intervalMs?: number;
  enabled?: boolean;
  refreshTrigger?: number;
}

export function useLiveData<T>(
  fetcher: () => Promise<T>,
  options: UseLiveDataOptions = {},
) {
  const { intervalMs = 5000, enabled = true, refreshTrigger = 0 } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const refresh = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch live data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    refresh();
    const timer = window.setInterval(refresh, intervalMs);
    return () => window.clearInterval(timer);
  }, [enabled, intervalMs, refresh, refreshTrigger]);

  return { data, loading, error, refresh };
}
