import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPasswordPage() {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { error('Please enter your email'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    success('Reset link sent! Check your email.');
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
            <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
            <p className="text-sm text-slate-400 mt-1">
              {sent ? 'We sent a reset link to your email.' : 'Enter your email to receive a reset link.'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)}
                leftIcon={<FaEnvelope size={14} />} required />
              <Button type="submit" isLoading={loading} fullWidth>Send Reset Link</Button>
            </form>
          ) : (
            <Link to="/auth/reset-password">
              <Button fullWidth>Continue to Reset Password</Button>
            </Link>
          )}

          <Link to="/auth/login" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-violet-400 mt-6 transition-colors">
            <FaArrowLeft size={12} /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
