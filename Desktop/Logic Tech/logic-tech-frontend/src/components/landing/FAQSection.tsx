import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaSearch, FaQuestionCircle } from 'react-icons/fa';
import { mockFAQs } from '../../data/mockData';

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(mockFAQs[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = mockFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 text-sm font-medium mb-4">
            <FaQuestionCircle className="text-slate-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to know about our IT solutions, delivery process, IP ownership, and getting started with Logic Tech.
          </p>
        </motion.div>

        {/* Search Filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-8"
        >
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. payments, vetting, IP ownership...)"
            className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10 transition-all"
          />
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-white leading-snug">
                      {faq.question}
                    </span>
                    <FaChevronDown
                      size={12}
                      className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
              <p className="text-slate-400 text-sm">No questions found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
