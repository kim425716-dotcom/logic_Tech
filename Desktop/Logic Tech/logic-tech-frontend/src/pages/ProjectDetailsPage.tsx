import { useCallback, useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { mockProjects } from '../data/mockData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import LiveIndicator from '../components/shared/LiveIndicator';
import { formatCurrency, formatDate } from '../lib/utils';
import type { Task, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useLiveData } from '../hooks/useLiveData';
import { LIVE_INTERVALS, loadLiveProject } from '../lib/liveData';

interface ProjectDetailsPageProps {
  role: UserRole;
}

export default function ProjectDetailsPage({ role }: ProjectDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { projectVersion } = useNotifications();
  const basePath = role === 'client' ? '/client' : '/consultant';

  const fetchProject = useCallback(
    () => loadLiveProject(id ?? '', user?.name),
    [id, user?.name, projectVersion],
  );

  const { data, loading } = useLiveData(fetchProject, {
    intervalMs: LIVE_INTERVALS.details,
    refreshTrigger: projectVersion,
    enabled: !!id,
  });

  const fallback = mockProjects.find(p => p.id === id);
  const project = data?.project ?? fallback;

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (project?.tasks) setTasks(project.tasks);
  }, [project]);

  if (!id) return <Navigate to={`${basePath}/projects`} replace />;
  if (!loading && !project) return <Navigate to={`${basePath}/projects`} replace />;
  if (!project) {
    return <div className="text-slate-500">Loading project…</div>;
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressDenominator = tasks.length || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to={`${basePath}/projects`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors">
          <FaArrowLeft size={12} /> Back to projects
        </Link>
        <LiveIndicator live={data?.live} intervalLabel="10s" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <Badge label={project.status} />
            <Badge label={project.priority} />
          </div>
          <p className="text-slate-400 max-w-2xl">{project.description}</p>
        </div>
        <Card glass padding="md" className="lg:w-64 flex-shrink-0">
          <p className="text-xs text-slate-500">Budget</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(project.budget)}</p>
          <p className="text-xs text-slate-500 mt-3">Deadline</p>
          <p className="text-sm text-white">{formatDate(project.deadline)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glass padding="md" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Tasks</h2>
            <span className="text-sm text-slate-500">{completedCount}/{tasks.length} complete</span>
          </div>
          <ProgressBar value={Math.round((completedCount / progressDenominator) * 100)} showLabel className="mb-4" />
          <ul className="space-y-2">
            {tasks.length ? tasks.map(task => (
              <li key={task.id}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    task.isCompleted ? 'bg-emerald-500/10' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                    task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                  }`}>
                    {task.isCompleted && <FaCheck size={10} className="text-white" />}
                  </span>
                  <span className={`text-sm ${task.isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-slate-600 ml-auto">{formatDate(task.dueDate)}</span>
                  )}
                </button>
              </li>
            )) : (
              <li className="text-sm text-slate-500">No tasks yet for this project.</li>
            )}
          </ul>
        </Card>

        <Card glass padding="md">
          <h2 className="font-semibold text-white mb-4">Details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Client</dt>
              <dd className="text-white">{project.clientName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Consultant</dt>
              <dd className="text-white">{project.consultantName ?? 'Not assigned'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="text-white">{project.category}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Created</dt>
              <dd className="text-white">{formatDate(project.createdAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
