import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { formatRelativeTime } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    hasNewArrival,
    markAllRead,
    markRead,
    dismiss,
    clearNewArrival,
  } = useNotifications();

  useEffect(() => {
    if (open && hasNewArrival) clearNewArrival();
  }, [open, hasNewArrival, clearNewArrival]);

  const typeColor: Record<string, string> = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="relative">
      <button
        id="notification-bell-btn"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <FaBell size={18} className={hasNewArrival ? 'animate-pulse text-violet-400' : ''} />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className={`absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-violet-500 rounded-full text-xs text-white flex items-center justify-center font-bold ${
              hasNewArrival ? 'ring-2 ring-violet-300/60' : ''
            }`}
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    <FaCheck size={10} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-violet-500/5' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColor[n.type]}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-slate-600 mt-1">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!n.read && (
                          <button onClick={() => markRead(n.id)} className="p-1 rounded text-slate-500 hover:text-emerald-400 transition-colors">
                            <FaCheck size={10} />
                          </button>
                        )}
                        <button onClick={() => dismiss(n.id)} className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors">
                          <FaTimes size={10} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
