import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';
import { useAuth, dashboardPath } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const user = await login({ email, password });
      success('Welcome back!');
      navigate(dashboardPath(user.role));
    } catch {
      error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <img
                src="/logo.png"
                alt="Logic Tech Logo"
                className="w-12 h-12 object-contain drop-shadow-md transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-white tracking-tight">Logic<span className="text-violet-400">Tech</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="alice@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<FaEnvelope size={14} />}
              id="login-email"
              required
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<FaLock size={14} />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-white transition-colors">
                  {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              }
              id="login-password"
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50" id="login-remember" />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" isLoading={loading} fullWidth rightIcon={<FaArrowRight size={12} />} id="login-submit-btn">
              Sign In
            </Button>
          </form>

          {/* Demo shortcuts */}
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-slate-500 text-center mb-2">Quick demo logins:</p>
            <div className="flex gap-2">
              {[
                { label: 'Client', email: 'alice@example.com' },
                { label: 'Consultant', email: 'consultant@example.com' },
                { label: 'Admin', email: 'admin@example.com' },
              ].map(demo => (
                <button
                  key={demo.label}
                  onClick={() => { setEmail(demo.email); setPassword('demo123'); }}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 text-slate-400 hover:text-violet-400 transition-all"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/auth/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
