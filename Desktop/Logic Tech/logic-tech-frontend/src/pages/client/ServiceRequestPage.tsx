import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockServices } from '../../data/mockData';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { useToast } from '../../contexts/ToastContext';
import { useLiveData } from '../../hooks/useLiveData';
import { LIVE_INTERVALS, loadLiveConsultants } from '../../lib/liveData';

export default function ServiceRequestPage() {
  const navigate = useNavigate();
  const { success } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    consultantId: '',
    priority: 'medium',
  });

  const fetchConsultants = useCallback(() => loadLiveConsultants(), []);
  const { data } = useLiveData(fetchConsultants, { intervalMs: LIVE_INTERVALS.consultants });

  const consultantOptions = useMemo(
    () => (data?.consultants ?? [])
      .filter(c => c.availability === 'available')
      .map(c => ({ value: c.id, label: `${c.name} — ${c.specialization}` })),
    [data?.consultants],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    success('Service request submitted! We\'ll match you with a consultant soon.');
    navigate('/client/projects');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">New Service Request</h1>
          <p className="text-slate-400 text-sm mt-1">Describe your project and we'll connect you with the right expert.</p>
        </div>
        <LiveIndicator live={data?.live} intervalLabel="10s" />
      </div>

      <Card glass padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Project Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4} required placeholder="Describe your requirements, goals, and timeline..." />
          <Select
            label="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            placeholder="Select a service"
            options={mockServices.map(s => ({ value: s.title, label: s.title }))}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Budget (USD)" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required />
            <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} required />
          </div>
          <Select
            label="Priority"
            value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          <Select
            label="Preferred Consultant (optional)"
            value={form.consultantId}
            onChange={e => setForm({ ...form, consultantId: e.target.value })}
            placeholder="Auto-match"
            options={consultantOptions}
          />
          <Button type="submit" isLoading={loading} fullWidth>Submit Request</Button>
        </form>
      </Card>
    </div>
  );
}
