import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaUser, FaTag, FaCommentAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';
import { sendContactEmail, EmailJSError } from '../../services/emailjs';
import Button from '../ui/Button';

export default function ContactSection() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [configInfo, setConfigInfo] = useState<string | null>(null);

  // Check EmailJS credentials configuration status
  useEffect(() => {
    const sid = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const tid = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const pk  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const placeholders = ['your_service_id', 'your_template_id', 'your_public_key', '', undefined];
    const hasLiveKeys = !placeholders.includes(sid) && !placeholders.includes(tid) && !placeholders.includes(pk);

    if (!hasLiveKeys) {
      setConfigInfo('Test Mode: Form is ready to test! (To enable real inbox delivery, add your EmailJS keys in logic-tech-frontend/.env and restart).');
    } else {
      setConfigInfo(null);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendContactEmail({
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setLoading(false);
      setSubmitted(true);
      success(res.message);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      setLoading(false);
      const msg = err instanceof EmailJSError
        ? err.message
        : (err?.message || 'An error occurred while sending your message.');
      error(msg);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Send Us a Message
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Have questions about our enterprise IT solutions or need custom software development? Connect with our engineering team directly.
          </p>
        </div>

        {/* Configuration Notice Banner */}
        {configInfo && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3.5"
          >
            <div className="flex items-center gap-2.5">
              <FaExclamationTriangle className="shrink-0 text-amber-400" size={15} />
              <p className="text-xs font-medium text-amber-200">{configInfo}</p>
            </div>
            <a
              href="https://www.emailjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              EmailJS Docs →
            </a>
          </motion.div>
        )}

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-8 sm:p-12 border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <FaCheckCircle className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-slate-300 max-w-md mx-auto mb-6 text-sm">
                Thank you for reaching out. We have received your message and will respond shortly.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="secondary">
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FaUser size={14} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FaEnvelope size={14} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Inquiry Topic
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FaTag size={14} />
                  </div>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm appearance-none"
                  >
                    <option value="General Inquiry" className="bg-slate-900">General Inquiry</option>
                    <option value="Custom Software Development" className="bg-slate-900">Custom Software Development</option>
                    <option value="Cloud & Cybersecurity" className="bg-slate-900">Cloud & Cybersecurity Architecture</option>
                    <option value="Enterprise Solution" className="bg-slate-900">Enterprise / Dedicated Engineering Team</option>
                    <option value="Support" className="bg-slate-900">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Message *
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-500">
                    <FaCommentAlt size={14} />
                  </div>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project, timeline, or any questions..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  ⚡ Powered by EmailJS integration.
                </p>
                <Button
                  type="submit"
                  isLoading={loading}
                  rightIcon={<FaPaperPlane size={12} />}
                  className="w-full sm:w-auto px-8"
                >
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
