import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars, FaTimes, FaMoon, FaSun, FaUser,
  FaSignInAlt, FaSignOutAlt, FaChevronDown, FaArrowRight
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
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-theme-surface/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-theme shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group relative py-1"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="/logo.png"
                alt="Logic Tech Logo"
                className="relative w-9 h-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
            <span className="text-lg font-bold text-theme-primary tracking-tight transition-colors duration-300">
              Logic<span className="text-amber-500 group-hover:text-amber-400 transition-colors">Tech</span>
            </span>
          </Link>

          {/* Desktop nav links with floating animated hover indicator */}
          <nav
            className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-theme-surface/50 dark:bg-slate-900/40 border border-theme/40 backdrop-blur-md"
            onMouseLeave={() => setHoveredNavIndex(null)}
          >
            {navLinks.map((link, idx) => {
              const isHovered = hoveredNavIndex === idx;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredNavIndex(idx)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isHovered
                      ? 'text-amber-600 dark:text-amber-400 font-semibold'
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  {isHovered && (
                    <motion.div
                      layoutId="navbar-hover-indicator"
                      className="absolute inset-0 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/25 dark:border-amber-400/30 shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.label}
                    {isHovered && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 inline-block"
                      />
                    )}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative p-2.5 rounded-xl text-theme-secondary hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 border border-transparent hover:border-amber-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <FaSun size={16} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-theme-hover border border-transparent hover:border-theme/60 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                    <span className="hidden sm:block text-sm font-medium text-theme-secondary">{user.name.split(' ')[0]}</span>
                    <FaChevronDown size={10} className={`text-theme-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 z-50 w-52 bg-theme-surface border border-theme rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl"
                        >
                          <Link
                            to={dashboardPath(user.role)}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-3 text-sm text-theme-secondary hover:bg-amber-500/10 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                          >
                            <FaUser size={12} /> Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors border-t border-theme/40"
                          >
                            <FaSignOutAlt size={12} /> Log Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2.5">
                <Link
                  to="/auth/login"
                  className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-hover hover:border-theme/60 border border-transparent transition-all duration-200 hover:scale-[1.02]"
                >
                  <FaSignInAlt size={12} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/auth/register"
                  className="group relative inline-flex items-center gap-2 px-4.5 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 overflow-hidden"
                >
                  <span className="relative z-10 font-bold">Get Started</span>
                  <FaArrowRight size={11} className="relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2.5 rounded-xl text-theme-secondary hover:text-theme-primary hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent transition-all hover:scale-105 active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-btn"
              aria-label="Toggle navigation menu"
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
            transition={{ duration: 0.25 }}
            className="md:hidden bg-theme-surface/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-theme overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-theme-secondary hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 border border-transparent hover:border-amber-500/20 transition-all duration-200 hover:translate-x-1"
                >
                  <span>{link.label}</span>
                  <FaArrowRight size={11} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-500" />
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-theme flex flex-col gap-2.5">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-hover border border-transparent hover:border-theme/40 transition-all text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 text-center shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
                >
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

