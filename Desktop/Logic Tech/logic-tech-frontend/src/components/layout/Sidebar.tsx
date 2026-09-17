import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaProjectDiagram, FaFileInvoiceDollar,
  FaComments, FaCog, FaSignOutAlt, FaChevronLeft, FaChevronRight,
  FaUsers, FaChartBar, FaClipboardList
} from 'react-icons/fa';
import type { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';
import { currentClientUser, currentAdminUser } from '../../data/mockData';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const clientNav: NavItem[] = [
  { label: 'Dashboard', href: '/client/dashboard', icon: FaTachometerAlt },
  { label: 'My Projects', href: '/client/projects', icon: FaProjectDiagram },
  { label: 'New Request', href: '/client/service-request', icon: FaClipboardList },
  { label: 'Messages', href: '/client/messages', icon: FaComments },
  { label: 'Payments', href: '/client/payments', icon: FaFileInvoiceDollar },
  { label: 'Settings', href: '/client/settings', icon: FaCog },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt },
  { label: 'Users', href: '/admin/users', icon: FaUsers },
  { label: 'Projects', href: '/admin/projects', icon: FaProjectDiagram },
  { label: 'Reports', href: '/admin/reports', icon: FaChartBar },
  { label: 'Settings', href: '/admin/settings', icon: FaCog },
];

interface SidebarProps {
  role: UserRole;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ role, collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const navItems = role === 'admin' ? adminNav : clientNav;
  const fallbackUser = role === 'admin' ? currentAdminUser : currentClientUser;
  const user = authUser ?? fallbackUser;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-theme-sidebar border-r border-theme overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-theme flex-shrink-0">
        <img
          src="/logo.png"
          alt="Logic Tech"
          className="w-8 h-8 object-contain flex-shrink-0"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-2.5 text-base font-bold text-theme-primary whitespace-nowrap overflow-hidden"
            >
              Logic<span className="text-violet-500">Tech</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-theme flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-2">
          <Avatar src={user.avatarUrl} name={user.name} size="sm" ring />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold text-theme-primary truncate">{user.name}</p>
                <p className="text-xs text-theme-muted truncate capitalize">{user.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-all"
          title={collapsed ? 'Log Out' : undefined}
        >
          <FaSignOutAlt size={14} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        id="sidebar-toggle-btn"
        className="absolute top-[4.25rem] -right-3 w-6 h-6 bg-toggle border border-theme rounded-full flex items-center justify-center text-theme-secondary hover:text-theme-primary shadow-md z-50 transition-colors"
      >
        {collapsed ? <FaChevronRight size={9} /> : <FaChevronLeft size={9} />}
      </button>
    </motion.aside>
  );
}
