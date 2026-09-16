import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { mockNotifications } from '../data/mockData';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Notification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  hasNewArrival: boolean;
  projectVersion: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
  clearNewArrival: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface WsNotificationPayload {
  type?: string;
  id?: string;
  user_id?: string;
  title?: string;
  message?: string;
  notif_type?: Notification['type'];
  read?: boolean;
  created_at?: string;
  link?: string;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [hasNewArrival, setHasNewArrival] = useState(false);
  const [projectVersion, setProjectVersion] = useState(0);

  const handleWsMessage = useCallback((raw: unknown) => {
    const payload = raw as WsNotificationPayload;

    if (payload.type === 'project_update') {
      setProjectVersion(v => v + 1);
      setHasNewArrival(true);
      return;
    }

    if (payload.type !== 'notification' || !payload.id || !payload.title || !payload.message) {
      return;
    }

    const incoming: Notification = {
      id: payload.id,
      userId: payload.user_id ?? user?.id ?? '',
      title: payload.title,
      message: payload.message,
      type: payload.notif_type ?? 'info',
      read: payload.read ?? false,
      createdAt: payload.created_at ?? new Date().toISOString(),
      link: payload.link,
    };

    setNotifications(prev => [incoming, ...prev]);
    setHasNewArrival(true);
  }, [user?.id]);

  useWebSocket(user ? `/ws/notifications/${user.id}` : null, {
    onMessage: handleWsMessage,
  });

  useEffect(() => {
    if (!user) {
      setNotifications(mockNotifications);
      setHasNewArrival(false);
      setProjectVersion(0);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNewArrival = useCallback(() => setHasNewArrival(false), []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        hasNewArrival,
        projectVersion,
        markAllRead,
        markRead,
        dismiss,
        clearNewArrival,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
