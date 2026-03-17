import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { payments, invoices } from '@/data/demo';

export default function PaymentsPage() {
  return (
    <div className="p-4">
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-foreground">Payments</h1>
        <p className="text-xs text-muted-foreground">{payments.length} payment records</p>
      </div>
      <DataTable
        data={payments}
        columns={[
          { key: 'invoice_id', header: 'Invoice', render: (p) => { const inv = invoices.find(i => i.id === p.invoice_id); return <span className="text-xs font-mono font-medium">{inv?.invoice_number || '—'}</span>; } },
          { key: 'amount', header: 'Amount', render: (p) => <span className="text-xs font-mono tabular-nums font-medium">€{p.amount.toFixed(2)}</span> },
          { key: 'payment_method', header: 'Method', render: (p) => <span className="text-xs capitalize">{p.payment_method.replace('_', ' ')}</span> },
          { key: 'payment_date', header: 'Date', render: (p) => <span className="text-xs font-mono">{new Date(p.payment_date).toLocaleDateString('nl-NL')}</span> },
          { key: 'reference', header: 'Reference', render: (p) => <span className="text-xs font-mono">{p.reference || '—'}</span> },
          { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
        ]}
        searchFields={['reference']}
        searchPlaceholder="Search payments..."
      />
    </div>
  );
}
