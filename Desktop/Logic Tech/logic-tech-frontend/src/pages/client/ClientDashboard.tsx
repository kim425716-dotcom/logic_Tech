import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaClipboardList, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
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
  computeClientStats,
  getFallbackClientStats,
  getFallbackProjects,
  LIVE_INTERVALS,
  loadLiveProjects,
} from '../../lib/liveData';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { projectVersion } = useNotifications();

  const fetchDashboardData = useCallback(async () => {
    const { projects, live } = await loadLiveProjects();
    return { stats: computeClientStats(projects), projects, live };
  }, [projectVersion]);

  const { data, loading } = useLiveData(fetchDashboardData, {
    intervalMs: LIVE_INTERVALS.lists,
    refreshTrigger: projectVersion,
  });

  const stats = data?.stats ?? getFallbackClientStats();
  const projects = data?.projects ?? mockProjects;
  const activeProjects = useMemo(
    () => projects.filter(p => p.status === 'in_progress' || p.status === 'pending'),
    [projects],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-400 text-sm mt-1">Here's an overview of your projects and activity.</p>
        </div>
        <LiveIndicator live={data?.live} />
        {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FaProjectDiagram} />
        <StatCard label="Pending Requests" value={stats.pendingRequests} icon={FaClipboardList} />
        <StatCard label="Total Spent" value={stats.totalSpent} icon={FaDollarSign} prefix="$" />
        <StatCard label="Completed" value={stats.completedProjects} icon={FaCheckCircle} trend="+2 this month" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Active Projects</h2>
          <Link to="/client/projects" className="text-sm text-violet-400 hover:text-violet-300">View all</Link>
        </div>
        <div className="grid gap-4">
          {(activeProjects.length ? activeProjects : getFallbackProjects().slice(0, 2)).map(project => (
            <Link key={project.id} to={`/client/projects/${project.id}`}>
              <Card hover glass>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{project.title}</h3>
                      <Badge label={project.status} />
                    </div>
                    <p className="text-sm text-slate-500">{project.consultantName ?? 'Awaiting consultant'} · Due {formatDate(project.deadline)}</p>
                  </div>
                  <div className="sm:w-48">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} />
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
