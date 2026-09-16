import { useCallback, useMemo } from 'react';
import { mockConsultants } from '../../data/mockData';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import StarRating from '../../components/shared/StarRating';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import { useLiveData } from '../../hooks/useLiveData';
import { LIVE_INTERVALS, loadLiveConsultants } from '../../lib/liveData';

export default function ConsultantProfilePage() {
  const { user } = useAuth();
  const { success } = useToast();

  const fetchProfile = useCallback(async () => {
    const { consultants, live } = await loadLiveConsultants();
    const profile = consultants.find(c => c.userId === user?.id || c.name === user?.name)
      ?? mockConsultants.find(c => c.userId === user?.id || c.name === user?.name)
      ?? mockConsultants[0];
    return { profile, live };
  }, [user?.id, user?.name]);

  const { data, loading } = useLiveData(fetchProfile, { intervalMs: LIVE_INTERVALS.consultants });
  const profile = data?.profile ?? mockConsultants[0];

  const availabilityLabel = useMemo(() => profile.availability, [profile.availability]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage how clients see you on the marketplace.</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} intervalLabel="10s" />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>

      <Card glass padding="lg">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar src={profile.avatarUrl} name={profile.name} size="xl" ring />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              {profile.verified && <Badge label="Verified" variant="success" />}
            </div>
            <p className="text-violet-400 font-medium">{profile.specialization}</p>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={profile.rating} />
              <span className="text-sm text-slate-500">{profile.reviewCount} reviews</span>
            </div>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
          <div>
            <p className="text-xs text-slate-500">Experience</p>
            <p className="text-lg font-bold text-white">{profile.experienceYears} yrs</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Projects</p>
            <p className="text-lg font-bold text-white">{profile.completedProjects}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Availability</p>
            <Badge label={availabilityLabel} />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-300 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-full text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-300 mb-2">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {profile.certifications.map(cert => (
              <span key={cert} className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-400">
                {cert}
              </span>
            ))}
          </div>
        </div>

        <Button className="mt-8" onClick={() => success('Profile edit would open a form in production.')}>
          Edit Profile
        </Button>
      </Card>
    </div>
  );
}
