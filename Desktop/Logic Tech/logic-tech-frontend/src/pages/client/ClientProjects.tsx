import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { getFallbackProjects } from '../../lib/liveData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useLiveProjects } from '../../hooks/useLiveProjects';

export default function ClientProjects() {
  const [search, setSearch] = useState('');
  const { data, loading } = useLiveProjects();
  const projects = data?.projects ?? getFallbackProjects();

  const filtered = useMemo(
    () => projects.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
    ),
    [projects, search],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
          <Link to="/client/service-request">
            <Button leftIcon={<FaPlus size={12} />}>New Request</Button>
          </Link>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />

      <div className="grid gap-4">
        {filtered.map(project => (
          <Link key={project.id} to={`/client/projects/${project.id}`}>
            <Card hover glass>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    <Badge label={project.status} />
                    <Badge label={project.priority} />
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                  <p className="text-xs text-slate-600 mt-1">{project.category} · {project.consultantName ?? 'Unassigned'}</p>
                </div>
                <div className="lg:w-52 flex-shrink-0">
                  <ProgressBar value={project.progress} />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>{formatCurrency(project.budget)}</span>
                    <span>Due {formatDate(project.deadline)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
