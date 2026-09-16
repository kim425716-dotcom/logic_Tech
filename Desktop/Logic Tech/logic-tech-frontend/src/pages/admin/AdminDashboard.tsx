import { useCallback, useMemo } from 'react';
import StatCard from '../../components/shared/StatCard';
import LiveIndicator from '../../components/shared/LiveIndicator';
import Card from '../../components/ui/Card';
import { BarChart, DonutChart } from '../../components/shared/Charts';
import { FaUsers, FaUserTie, FaProjectDiagram, FaDollarSign, FaClipboardCheck } from 'react-icons/fa';
import { formatCurrency } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLiveData } from '../../hooks/useLiveData';
import { getFallbackAdminStats, getFallbackProjects, LIVE_INTERVALS, loadLiveAdminData } from '../../lib/liveData';

export default function AdminDashboard() {
  const { projectVersion } = useNotifications();

  const fetchAdminData = useCallback(
    () => loadLiveAdminData(),
    [projectVersion],
  );

  const { data, loading } = useLiveData(fetchAdminData, {
    intervalMs: LIVE_INTERVALS.lists,
    refreshTrigger: projectVersion,
  });

  const stats = data?.stats ?? getFallbackAdminStats();
  const projects = data?.projects ?? getFallbackProjects();

  const donutSegments = useMemo(() => [
    { label: 'In Progress', value: projects.filter(p => p.status === 'in_progress').length || 1, color: '#6366f1' },
    { label: 'Completed', value: projects.filter(p => p.status === 'completed').length || 1, color: '#10b981' },
    { label: 'Pending', value: projects.filter(p => p.status === 'pending').length || 1, color: '#f59e0b' },
  ], [projects]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Platform overview and key metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={FaUsers} />
        <StatCard label="Consultants" value={stats.totalConsultants} icon={FaUserTie} />
        <StatCard label="Clients" value={stats.totalClients} icon={FaUsers} />
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FaProjectDiagram} />
        <StatCard label="Total Revenue" value={stats.totalRevenue} icon={FaDollarSign} prefix="$" />
        <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon={FaClipboardCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass padding="md">
          <BarChart
            title="New Users (Monthly)"
            data={[
              { label: 'Mar', value: 320 },
              { label: 'Apr', value: 410 },
              { label: 'May', value: 380 },
              { label: 'Jun', value: 520 },
            ]}
          />
        </Card>
        <Card glass padding="md">
          <DonutChart
            centerLabel="Projects"
            centerValue={String(projects.length)}
            segments={donutSegments}
          />
        </Card>
      </div>

      <Card glass padding="md">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {projects.slice(0, 3).map(p => (
            <div key={p.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm text-white">{p.title}</p>
                <p className="text-xs text-slate-500">{p.clientName} → {p.consultantName ?? 'Unassigned'}</p>
              </div>
              <span className="text-sm text-slate-400">{formatCurrency(p.budget)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
