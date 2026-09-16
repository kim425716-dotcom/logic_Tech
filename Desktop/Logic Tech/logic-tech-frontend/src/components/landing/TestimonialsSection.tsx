import { motion } from 'framer-motion';
import { mockTestimonials } from '../../data/mockData';
import { TestimonialMarquee, type Testimonial as MarqueeTestimonial } from '@/components/ui/testimonial-marquee';

export default function TestimonialsSection() {
  // Map mockTestimonials → the shape TestimonialMarquee expects
  const items: MarqueeTestimonial[] = mockTestimonials.map((t) => ({
    name: t.name,
    text: t.content,
    avatar: t.avatarUrl ?? `https://i.pravatar.cc/150?u=${t.id}`,
    role: `${t.role} @ ${t.company}`,
  }));

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 text-sm font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real feedback from businesses that transformed their IT operations with Logic Tech.
          </p>
        </motion.div>
      </div>

      {/* Full-width marquee — intentionally breaks out of the container */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <TestimonialMarquee
          items={items}
          variant="dual"
          speed={35}
          containerClassName="px-4"
        />
      </motion.div>
    </section>
  );
}
