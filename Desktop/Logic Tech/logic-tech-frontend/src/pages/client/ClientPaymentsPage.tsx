import { useCallback, useMemo, useState } from 'react';
import { FaCreditCard } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LiveIndicator from '../../components/shared/LiveIndicator';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../contexts/ToastContext';
import { useLiveData } from '../../hooks/useLiveData';
import { getFallbackInvoices, LIVE_INTERVALS, loadLiveInvoices } from '../../lib/liveData';

export default function ClientPaymentsPage() {
  const { success, info } = useToast();
  const [paying, setPaying] = useState<string | null>(null);

  const fetchInvoices = useCallback(() => loadLiveInvoices(), []);
  const { data, loading } = useLiveData(fetchInvoices, { intervalMs: LIVE_INTERVALS.lists });
  const invoices = data?.invoices ?? getFallbackInvoices();

  const handlePay = async (invoiceId: string) => {
    setPaying(invoiceId);
    await new Promise(r => setTimeout(r, 1500));
    setPaying(null);
    info('In production, this would redirect to Stripe Checkout.');
    success(`Payment initiated for ${invoiceId}`);
  };

  const totalPending = useMemo(
    () => invoices.filter(i => i.status === 'pending' || i.status === 'overdue')
      .reduce((sum, i) => sum + i.amount, 0),
    [invoices],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments & Invoices</h1>
          <p className="text-slate-400 text-sm mt-1">
            {formatCurrency(totalPending)} outstanding across {invoices.filter(i => i.status !== 'paid').length} invoices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator live={data?.live} />
          {loading && !data && <span className="text-xs text-slate-500">Loading…</span>}
        </div>
      </div>

      <div className="grid gap-4">
        {invoices.map(invoice => (
          <Card key={invoice.id} glass padding="md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-violet-400">{invoice.id}</span>
                  <Badge label={invoice.status} />
                </div>
                <p className="font-semibold text-white">{invoice.projectTitle}</p>
                <p className="text-sm text-slate-500">{invoice.serviceTitle ?? 'Project Milestone'} · Due {formatDate(invoice.dueDate)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xl font-bold text-white">{formatCurrency(invoice.amount)}</p>
                {invoice.status !== 'paid' && (
                  <Button
                    size="sm"
                    leftIcon={<FaCreditCard size={12} />}
                    isLoading={paying === invoice.id}
                    onClick={() => handlePay(invoice.id)}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
