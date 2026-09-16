
import { motion } from 'framer-motion';
import { platformStats } from '../../data/mockData';

export default function StatsSection() {
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {platformStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/10"
            >
              <p className="text-4xl font-extrabold text-white mb-1 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-slate-300">{stat.label}</p>
              {stat.description && <p className="text-xs text-slate-500 mt-1">{stat.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
