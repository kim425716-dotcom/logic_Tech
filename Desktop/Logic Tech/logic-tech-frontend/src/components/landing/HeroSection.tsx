
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShieldAlt, FaStar, FaUsers } from 'react-icons/fa';
import KineticGrid from '@/components/ui/kinetic-grid';

export default function HeroSection() {
  return (
    <KineticGrid contained className="min-h-screen bg-slate-950">
      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-sm font-medium text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Trusted by 3,000+ businesses worldwide
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Enterprise IT
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Solutions
              </span>
              <br />
              You Can Trust
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Logic Tech delivers cutting-edge software engineering, cloud architecture, cybersecurity, and IT solutions tailored to scale your enterprise.
            </p>

            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/auth/register"
                id="hero-get-started-btn"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-2xl shadow-amber-500/30 transition-all hover:from-amber-400 hover:to-yellow-400"
              >
                Get Started Free <FaArrowRight size={14} />
              </Link>
              <a
                href="#services"
                className="flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 text-base font-semibold text-slate-300 transition-all hover:border-white/20 hover:bg-white/5"
              >
                Explore Services
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-emerald-400" />
                <span>100% Secure Delivery</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <FaStar className="text-amber-400" />
                <span>4.9/5 Client Rating</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-400" />
                <span>Dedicated Tech Specialists</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </KineticGrid>
  );
}
