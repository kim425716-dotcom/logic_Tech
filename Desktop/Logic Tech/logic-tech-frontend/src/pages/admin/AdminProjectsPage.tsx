import { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import SearchBar from '../../components/ui/SearchBar';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useLiveProjects } from '../../hooks/useLiveProjects';
import { getFallbackProjects } from '../../lib/liveData';

export default function AdminProjectsPage() {
  const [search, setSearch] = useState('');
  const { data, loading } = useLiveProjects();
  const projects = data?.projects ?? getFallbackProjects();

  const filtered = useMemo(
    () => projects.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()),
    ),
    [projects, search],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage platform-wide project activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
      <div className="grid gap-4">
        {filtered.map(project => (
          <Card key={project.id} glass padding="md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  <Badge label={project.status} />
                </div>
                <p className="text-sm text-slate-500">{project.clientName} · {project.category}</p>
              </div>
              <div className="lg:w-48">
                <ProgressBar value={project.progress} showLabel />
                <p className="text-xs text-slate-500 mt-1">{formatCurrency(project.budget)} · {formatDate(project.deadline)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
