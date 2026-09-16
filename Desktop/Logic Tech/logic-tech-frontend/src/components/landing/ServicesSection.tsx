import { motion } from 'framer-motion';
import FeatureShaderCards from '@/components/ui/feature-shader-cards';

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything Your Business Needs
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From development to deployment, our consultants cover every critical IT domain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <FeatureShaderCards />
        </motion.div>
      </div>
    </section>
  );
}
