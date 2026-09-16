import Card from '../ui/Card';
import { formatCurrency } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  prefix?: string;
}

export default function StatCard({ label, value, icon: Icon, trend, prefix }: StatCardProps) {
  const display = typeof value === 'number' && prefix === '$' ? formatCurrency(value) : value;

  return (
    <Card glass padding="md" hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{display}</p>
          {trend && <p className="text-xs text-emerald-400 mt-1">{trend}</p>}
        </div>
        <div className="p-3 rounded-xl bg-violet-500/20">
          <Icon className="text-violet-400" size={18} />
        </div>
      </div>
    </Card>
  );
}
