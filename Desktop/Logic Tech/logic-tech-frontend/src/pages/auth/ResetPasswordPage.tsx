import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaArrowRight } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { error('Password must be at least 6 characters'); return; }
    if (password !== confirm) { error('Passwords do not match'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    success('Password updated successfully!');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-5 group">
              <img
                src="/logo.png"
                alt="Logic Tech Logo"
                className="w-12 h-12 object-contain mx-auto drop-shadow-md transition-transform group-hover:scale-105"
              />
            </Link>
            <h1 className="text-2xl font-bold text-white">Reset password</h1>
            <p className="text-sm text-slate-400 mt-1">Choose a new password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              leftIcon={<FaLock size={14} />} required />
            <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              leftIcon={<FaLock size={14} />} required />
            <Button type="submit" isLoading={loading} fullWidth rightIcon={<FaArrowRight size={12} />}>
              Update Password
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            <Link to="/auth/login" className="text-violet-400 hover:text-violet-300 font-semibold">Back to sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
