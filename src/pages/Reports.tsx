import { KPICard } from '@/components/KPICard';
import { invoices, workOrders, quotes, parts } from '@/data/demo';
import { BarChart3, TrendingUp, FileText, Package } from 'lucide-react';

export default function ReportsPage() {
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const outstanding = invoices.filter(i => i.balance_due > 0).reduce((s, i) => s + i.balance_due, 0);
  const avgOrderValue = totalRevenue / Math.max(invoices.filter(i => i.status === 'paid').length, 1);
  const quoteAcceptance = quotes.filter(q => ['approved', 'converted'].includes(q.status)).length / Math.max(quotes.length, 1) * 100;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Reports & Analytics</h1>
        <p className="text-xs text-muted-foreground">Business performance overview</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard title="Total Revenue" value={`€${totalRevenue.toFixed(0)}`} icon={TrendingUp} variant="success" />
        <KPICard title="Outstanding" value={`€${outstanding.toFixed(0)}`} icon={BarChart3} variant={outstanding > 0 ? 'danger' : 'default'} />
        <KPICard title="Avg Order Value" value={`€${avgOrderValue.toFixed(0)}`} icon={FileText} />
        <KPICard title="Quote Acceptance" value={`${quoteAcceptance.toFixed(0)}%`} icon={FileText} />
      </div>
      <div className="border rounded-md bg-card p-8 text-center text-muted-foreground text-sm">Detailed charts and exportable reports coming soon.</div>
    </div>
  );
}
