
import { motion } from 'framer-motion';
import { FaSearch, FaHandshake, FaRocket, FaStar } from 'react-icons/fa';

const steps = [
  {
    step: '01', icon: FaSearch,
    title: 'Describe Your Requirements',
    description: 'Submit your technical specifications, business goals, and timeline. Our architects review your needs in minutes.',
    color: 'from-violet-500 to-indigo-500',
  },
  {
    step: '02', icon: FaHandshake,
    title: 'Tailored Solution & Scope',
    description: 'Receive a clear technical roadmap, milestone breakdown, and transparent pricing customized to your stack.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    step: '03', icon: FaRocket,
    title: 'Engineering & Deployment',
    description: 'Our engineering team executes your project with milestone tracking, real-time communication, and rigorous QA.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    step: '04', icon: FaStar,
    title: 'Delivery & Ongoing Support',
    description: 'Review deliverables, launch to production seamlessly, and enjoy full IP ownership with ongoing technical support.',
    color: 'from-amber-500 to-orange-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Get Started in 4 Simple Steps</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From requirement to enterprise production, we make IT delivery seamless and reliable.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-6 rounded-2xl bg-slate-900 border border-white/5 text-center"
            >
              <div className="text-6xl font-extrabold text-white/5 absolute top-4 right-4">{step.step}</div>
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-xl`}>
                <step.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
