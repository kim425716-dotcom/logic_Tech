import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import { useTheme } from '../../contexts/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
import type { UserRole } from '../../types';

interface DashboardLayoutProps {
  role: UserRole;
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="min-h-screen bg-theme-base flex">
      <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen flex flex-col"
      >
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 flex items-center justify-end gap-3 px-6 bg-theme-topbar border-b border-theme sticky top-0 z-30 shadow-sm dark:shadow-none">
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn-dashboard"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-theme-secondary hover:text-theme-primary bg-theme-hover transition-all"
          >
            {isDark
              ? <FaSun size={16} className="text-amber-400" />
              : <FaMoon size={16} />
            }
          </button>
          <NotificationDropdown />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
