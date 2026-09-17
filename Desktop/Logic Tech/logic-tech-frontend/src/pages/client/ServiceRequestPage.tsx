import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockServices } from '../../data/mockData';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';

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
    priority: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    success('Service request submitted! Our engineering team will review and begin shortly.');
    navigate('/client/projects');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">New Service Request</h1>
          <p className="text-slate-400 text-sm mt-1">Describe your project requirements and our engineering team will get started.</p>
        </div>
      </div>

      <Card glass padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Project Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4} required placeholder="Describe your technical requirements, goals, and timeline..." />
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
          <Button type="submit" isLoading={loading} fullWidth>Submit Request</Button>
        </form>
      </Card>
    </div>
  );
}
