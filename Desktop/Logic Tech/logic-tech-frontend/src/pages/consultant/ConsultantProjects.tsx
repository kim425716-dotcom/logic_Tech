import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFallbackProjects } from '../../lib/liveData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import SearchBar from '../../components/ui/SearchBar';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useLiveProjects } from '../../hooks/useLiveProjects';

export default function ConsultantProjects() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const { data, loading } = useLiveProjects({ userName: user?.name });
  const allProjects = data?.projects ?? getFallbackProjects();
  const projects = allProjects.filter(p => p.consultantName === user?.name || p.consultantId === user?.id);

  const list = useMemo(
    () => (projects.length ? projects : allProjects).filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    ),
    [projects, allProjects, search],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{list.length} assigned projects</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
      <div className="grid gap-4">
        {list.map(project => (
          <Link key={project.id} to={`/consultant/projects/${project.id}`}>
            <Card hover glass>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    <Badge label={project.status} />
                  </div>
                  <p className="text-sm text-slate-500">{project.clientName} · {project.category}</p>
                </div>
                <div className="lg:w-52">
                  <ProgressBar value={project.progress} showLabel />
                  <p className="text-xs text-slate-500 mt-2 text-right">{formatCurrency(project.budget)} · Due {formatDate(project.deadline)}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
