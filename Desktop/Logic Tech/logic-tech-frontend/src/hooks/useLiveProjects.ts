import { useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useLiveData } from './useLiveData';
import { LIVE_INTERVALS, loadLiveProjects } from '../lib/liveData';

interface UseLiveProjectsOptions {
  userName?: string;
  intervalMs?: number;
}

export function useLiveProjects(options: UseLiveProjectsOptions = {}) {
  const { projectVersion } = useNotifications();
  const { userName, intervalMs = LIVE_INTERVALS.lists } = options;

  const fetcher = useCallback(
    () => loadLiveProjects(userName),
    [userName, projectVersion],
  );

  return useLiveData(fetcher, {
    intervalMs,
    refreshTrigger: projectVersion,
  });
}
