import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { mockConsultants } from '../../data/mockData';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import StarRating from '../shared/StarRating';
import { useLiveData } from '../../hooks/useLiveData';
import { LIVE_INTERVALS, loadLiveConsultants } from '../../lib/liveData';

export default function ConsultantsSection() {
  const fetchConsultants = useCallback(() => loadLiveConsultants(), []);
  const { data } = useLiveData(fetchConsultants, { intervalMs: LIVE_INTERVALS.consultants });
  const featured = (data?.consultants ?? mockConsultants).slice(0, 4);

  return (
    <section id="consultants" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            Top Consultants
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet Our Expert Consultants</h2>
          <p className="text-slate-400 max-w-xl mx-auto">All vetted, rated, and ready to work on your next project.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {featured.map((consultant, idx) => (
            <motion.div
              key={consultant.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="group p-5 rounded-2xl bg-slate-900 border border-white/5 hover:border-violet-500/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Avatar src={consultant.avatarUrl} name={consultant.name} size="lg" ring />
                {consultant.verified && (
                  <FaCheckCircle className="text-violet-400 mt-1" size={14} title="Verified" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-white">{consultant.name}</h3>
              <p className="text-xs text-violet-400 mb-2">{consultant.specialization}</p>
              <div className="flex items-center gap-1 mb-3">
                <StarRating rating={consultant.rating} size="sm" />
                <span className="text-xs text-slate-500">({consultant.reviewCount})</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {consultant.skills.slice(0, 3).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-end">
                <Badge label={consultant.availability} />
              </div>
              {consultant.location && (
                <p className="flex items-center gap-1 text-xs text-slate-600 mt-2">
                  <FaMapMarkerAlt size={10} /> {consultant.location}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition-all">
            View All Consultants <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
