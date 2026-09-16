import { useCallback } from 'react';
import Card from '../../components/ui/Card';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { BarChart, DonutChart } from '../../components/shared/Charts';
import { formatCurrency } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLiveData } from '../../hooks/useLiveData';
import { getFallbackAdminStats, LIVE_INTERVALS, loadLiveAdminData } from '../../lib/liveData';

export default function AdminReportsPage() {
  const { projectVersion } = useNotifications();

  const fetchReports = useCallback(
    () => loadLiveAdminData(),
    [projectVersion],
  );

  const { data, loading } = useLiveData(fetchReports, {
    intervalMs: LIVE_INTERVALS.lists,
    refreshTrigger: projectVersion,
  });

  const stats = data?.stats ?? getFallbackAdminStats();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 text-sm mt-1">Analytics and platform performance insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass padding="md">
          <BarChart
            title="Revenue (USD thousands)"
            data={[
              { label: 'Q1', value: 280, color: '#7c3aed' },
              { label: 'Q2', value: 340, color: '#6366f1' },
              { label: 'Q3', value: 410, color: '#4f46e5' },
              { label: 'Q4', value: 220, color: '#4338ca' },
            ]}
          />
        </Card>
        <Card glass padding="md">
          <DonutChart
            centerLabel="Revenue"
            centerValue={formatCurrency(stats.totalRevenue)}
            segments={[
              { label: 'Web Dev', value: 35, color: '#8b5cf6' },
              { label: 'Security', value: 25, color: '#6366f1' },
              { label: 'Data/AI', value: 20, color: '#3b82f6' },
              { label: 'Other', value: 20, color: '#06b6d4' },
            ]}
          />
        </Card>
      </div>

      <Card glass padding="md">
        <h2 className="text-lg font-semibold text-white mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Conversion Rate', value: '12.4%' },
            { label: 'Avg Project Value', value: formatCurrency(Math.round(stats.totalRevenue / Math.max(stats.activeProjects, 1))) },
            { label: 'Consultant Retention', value: '89%' },
            { label: 'Client Satisfaction', value: '4.8/5' },
          ].map(m => (
            <div key={m.label}>
              <p className="text-xs text-slate-500">{m.label}</p>
              <p className="text-xl font-bold text-white mt-1">{m.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
