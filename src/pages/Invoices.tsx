import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { invoices, getCustomer, getVehicle } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function InvoicesPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Invoices</h1>
          <p className="text-xs text-muted-foreground">{invoices.length} invoices</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3 w-3" /> New Invoice</Button>
      </div>
      <DataTable
        data={invoices}
        columns={[
          { key: 'invoice_number', header: 'Invoice #', render: (i) => <span className="text-xs font-mono font-semibold">{i.invoice_number}</span> },
          { key: 'customer_id', header: 'Customer', render: (i) => { const c = getCustomer(i.customer_id); return <span className="text-xs">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>; } },
          { key: 'vehicle_id', header: 'Vehicle', render: (i) => { const v = getVehicle(i.vehicle_id); return <span className="text-xs font-mono">{v?.license_plate || '—'}</span>; } },
          { key: 'total', header: 'Total', render: (i) => <span className="text-xs font-mono tabular-nums font-medium">€{i.total.toFixed(2)}</span> },
          { key: 'amount_paid', header: 'Paid', render: (i) => <span className="text-xs font-mono tabular-nums">€{i.amount_paid.toFixed(2)}</span> },
          { key: 'balance_due', header: 'Balance', render: (i) => <span className={`text-xs font-mono tabular-nums font-medium ${i.balance_due > 0 ? 'text-destructive' : 'text-foreground'}`}>€{i.balance_due.toFixed(2)}</span> },
          { key: 'due_date', header: 'Due Date', render: (i) => <span className="text-xs font-mono">{new Date(i.due_date).toLocaleDateString('nl-NL')}</span> },
          { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} /> },
        ]}
        searchFields={['invoice_number']}
        searchPlaceholder="Search invoices..."
      />
    </div>
  );
}
