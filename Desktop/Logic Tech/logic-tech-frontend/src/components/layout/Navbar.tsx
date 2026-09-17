import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars, FaTimes, FaMoon, FaSun, FaUser,
  FaSignInAlt, FaSignOutAlt, FaChevronDown
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth, dashboardPath } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';
import NotificationDropdown from './NotificationDropdown';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-theme-surface/80 backdrop-blur-xl border-b border-theme shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Logic Tech Logo"
              className="w-9 h-9 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
            />
            <span className="text-lg font-bold text-theme-primary tracking-tight">
              Logic<span className="text-amber-500">Tech</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-hover transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-theme-secondary hover:text-theme-primary hover:bg-theme-hover transition-all"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSun size={16} className="text-amber-400" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaMoon size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {isAuthenticated && user ? (
              <>
                <NotificationDropdown />
                <div className="relative">
                  <button
                    id="user-menu-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-theme-hover transition-all"
                  >
                    <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                    <span className="hidden sm:block text-sm font-medium text-theme-secondary">{user.name.split(' ')[0]}</span>
                    <FaChevronDown size={10} className="text-theme-muted" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          className="absolute right-0 top-12 z-50 w-48 bg-theme-surface border border-theme rounded-xl shadow-xl overflow-hidden"
                        >
                          <Link to={dashboardPath(user.role)} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-3 text-sm text-theme-secondary hover:bg-theme-hover hover:text-theme-primary transition-colors">
                            <FaUser size={12} /> Dashboard
                          </Link>
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors">
                            <FaSignOutAlt size={12} /> Log Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-hover transition-all">
                  <FaSignInAlt size={12} /> Sign In
                </Link>
                <Link to="/auth/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-theme-secondary hover:text-theme-primary hover:bg-theme-hover transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-btn"
            >
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-theme-surface/95 backdrop-blur-xl border-b border-theme"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-hover transition-all">
                  {link.label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-theme flex flex-col gap-2">
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-theme-secondary hover:bg-theme-hover transition-all text-center">
                  Sign In
                </Link>
                <Link to="/auth/register" onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
