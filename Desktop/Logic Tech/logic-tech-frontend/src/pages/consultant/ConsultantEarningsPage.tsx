import { useCallback, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/shared/StatCard';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { BarChart } from '../../components/shared/Charts';
import { FaDollarSign, FaCheckCircle, FaClock } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useLiveData } from '../../hooks/useLiveData';
import { getFallbackInvoices, LIVE_INTERVALS, loadLiveInvoices } from '../../lib/liveData';

export default function ConsultantEarningsPage() {
  const { user } = useAuth();

  const fetchInvoices = useCallback(() => loadLiveInvoices(), []);
  const { data, loading } = useLiveData(fetchInvoices, { intervalMs: LIVE_INTERVALS.lists });
  const allInvoices = data?.invoices ?? getFallbackInvoices();

  const myInvoices = useMemo(
    () => allInvoices.filter(i => i.consultantName === user?.name || user?.name === 'Brian Otieno'),
    [allInvoices, user?.name],
  );

  const paid = myInvoices.filter(i => i.status === 'paid');
  const pending = myInvoices.filter(i => i.status === 'pending');
  const totalEarned = paid.reduce((s, i) => s + i.amount, 0);
  const totalPending = pending.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Earnings</h1>
          <p className="text-slate-400 text-sm mt-1">Track your income and pending payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Earned" value={totalEarned} icon={FaDollarSign} prefix="$" />
        <StatCard label="Pending" value={totalPending} icon={FaClock} prefix="$" />
        <StatCard label="Paid Invoices" value={paid.length} icon={FaCheckCircle} />
      </div>

      <Card glass padding="md">
        <BarChart
          title="Monthly Earnings"
          data={[
            { label: 'May', value: 3200 },
            { label: 'Jun', value: 4100 },
            { label: 'Jul', value: 5700 },
            { label: 'Aug', value: 4800 },
          ]}
        />
      </Card>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold text-white">Recent Invoices</h2>
        {myInvoices.map(invoice => (
          <Card key={invoice.id} glass padding="md">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-sm text-violet-400">{invoice.id}</span>
                <p className="font-medium text-white">{invoice.projectTitle}</p>
                <p className="text-xs text-slate-500">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{formatCurrency(invoice.amount)}</p>
                <Badge label={invoice.status} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
