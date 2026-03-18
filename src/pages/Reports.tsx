import { KPICard } from '@/components/KPICard';
import { DataTable } from '@/components/DataTable';
import { useWorkshopStore } from '@/context/WorkshopContext';
import { BarChart3, TrendingUp, FileText, Package } from 'lucide-react';

export default function ReportsPage() {
  const { getCustomer, invoices, parts, quotes, workOrders } = useWorkshopStore();
  const totalRevenue = invoices.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.total, 0);
  const outstanding = invoices.filter((item) => item.balance_due > 0).reduce((sum, item) => sum + item.balance_due, 0);
  const avgOrderValue = totalRevenue / Math.max(invoices.filter((item) => item.status === 'paid').length, 1);
  const quoteAcceptance = (quotes.filter((item) => ['approved', 'converted'].includes(item.status)).length / Math.max(quotes.length, 1)) * 100;
  const partsMargin = parts.reduce((sum, item) => sum + (item.sale_price - item.purchase_price) * item.stock_quantity, 0);

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
        <KPICard title="Quote Acceptance" value={`${quoteAcceptance.toFixed(0)}%`} icon={Package} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Invoice Ledger</h2>
          <DataTable
            data={invoices}
            columns={[
              { key: 'invoice_number', header: 'Invoice', render: (item) => <span className="text-xs font-mono">{item.invoice_number}</span> },
              { key: 'customer_id', header: 'Customer', render: (item) => <span className="text-xs">{getCustomer(item.customer_id)?.first_name} {getCustomer(item.customer_id)?.last_name}</span> },
              { key: 'total', header: 'Total', render: (item) => <span className="text-xs font-mono">€{item.total.toFixed(2)}</span> },
              { key: 'amount_paid', header: 'Paid', render: (item) => <span className="text-xs font-mono">€{item.amount_paid.toFixed(2)}</span> },
              { key: 'balance_due', header: 'Open', render: (item) => <span className="text-xs font-mono">€{item.balance_due.toFixed(2)}</span> },
              { key: 'status', header: 'Status' },
            ]}
            searchFields={['invoice_number']}
            searchPlaceholder="Search invoices..."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Work Order Throughput</h2>
          <DataTable
            data={workOrders}
            columns={[
              { key: 'work_order_number', header: 'WO #', render: (item) => <span className="text-xs font-mono">{item.work_order_number}</span> },
              { key: 'status', header: 'Status' },
              { key: 'priority', header: 'Priority' },
              { key: 'promised_date', header: 'Promised', render: (item) => <span className="text-xs font-mono">{item.promised_date ? new Date(item.promised_date).toLocaleDateString('nl-NL') : '—'}</span> },
              { key: 'updated_at', header: 'Updated', render: (item) => <span className="text-xs font-mono">{new Date(item.updated_at).toLocaleDateString('nl-NL')}</span> },
            ]}
            searchFields={['work_order_number', 'status']}
            searchPlaceholder="Search work orders..."
          />
        </div>
      </div>

      <div className="border rounded-md bg-card p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Inventory Margin Snapshot</h3>
            <p className="text-xs text-muted-foreground">Live from the demo state, so totals change when you edit parts and invoices.</p>
          </div>
          <span className="text-sm font-semibold tabular-nums text-foreground">€{partsMargin.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
