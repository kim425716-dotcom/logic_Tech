import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';
import { useAuth, dashboardPath } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { RegisterData } from '../../types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();
  const [form, setForm] = useState<RegisterData>({
    name: '', email: '', password: '', role: 'client',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      success('Account created successfully!');
      navigate(dashboardPath(user.role));
    } catch {
      error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <img
                src="/logo.png"
                alt="Logic Tech Logo"
                className="w-12 h-12 object-contain drop-shadow-md transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-white tracking-tight">Logic<span className="text-violet-400">Tech</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-sm text-slate-400 mt-1">Join leading businesses building with Logic Tech</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              leftIcon={<FaUser size={14} />} required />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              leftIcon={<FaEnvelope size={14} />} required />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              leftIcon={<FaLock size={14} />} required />

            <Button type="submit" isLoading={loading} fullWidth rightIcon={<FaArrowRight size={12} />}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-violet-400 hover:text-violet-300 font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
