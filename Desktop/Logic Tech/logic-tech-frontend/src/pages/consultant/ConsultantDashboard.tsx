import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaClipboardList, FaDollarSign, FaStar } from 'react-icons/fa';
import { mockProjects } from '../../data/mockData';
import StatCard from '../../components/shared/StatCard';
import LiveIndicator from '../../components/shared/LiveIndicator';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLiveData } from '../../hooks/useLiveData';
import {
  computeConsultantStats,
  getFallbackConsultantStats,
  getFallbackProjects,
  LIVE_INTERVALS,
  loadLiveProjects,
} from '../../lib/liveData';

export default function ConsultantDashboard() {
  const { user } = useAuth();
  const { projectVersion } = useNotifications();

  const fetchDashboardData = useCallback(async () => {
    const { projects, live } = await loadLiveProjects(user?.name);
    return {
      stats: computeConsultantStats(projects, user?.id),
      projects,
      live,
    };
  }, [user?.id, user?.name, projectVersion]);

  const { data, loading } = useLiveData(fetchDashboardData, {
    intervalMs: LIVE_INTERVALS.lists,
    refreshTrigger: projectVersion,
  });

  const stats = data?.stats ?? getFallbackConsultantStats();
  const projects = data?.projects ?? mockProjects;
  const myProjects = useMemo(
    () => projects.filter(p => p.consultantName === user?.name || p.consultantId === user?.id),
    [projects, user?.id, user?.name],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hello, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-400 text-sm mt-1">Your consulting dashboard at a glance.</p>
        </div>
        <LiveIndicator live={data?.live} />
        {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FaProjectDiagram} />
        <StatCard label="Pending Proposals" value={stats.pendingProposals} icon={FaClipboardList} />
        <StatCard label="Total Earned" value={stats.totalEarned} icon={FaDollarSign} prefix="$" />
        <StatCard label="Avg Rating" value={stats.avgRating} icon={FaStar} trend="4.9 from 47 reviews" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Projects</h2>
          <Link to="/consultant/projects" className="text-sm text-violet-400 hover:text-violet-300">View all</Link>
        </div>
        <div className="grid gap-4">
          {(myProjects.length ? myProjects : getFallbackProjects().slice(0, 2)).map(project => (
            <Link key={project.id} to={`/consultant/projects/${project.id}`}>
              <Card hover glass>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{project.title}</h3>
                      <Badge label={project.status} />
                    </div>
                    <p className="text-sm text-slate-500">{project.clientName} · Due {formatDate(project.deadline)}</p>
                  </div>
                  <div className="sm:w-48">
                    <ProgressBar value={project.progress} showLabel />
                    <p className="text-xs text-slate-500 mt-1 text-right">{formatCurrency(project.budget)}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
