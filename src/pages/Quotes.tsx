import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { quotes, getCustomer, getVehicle } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function QuotesPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Quotes & Estimates</h1>
          <p className="text-xs text-muted-foreground">{quotes.length} quotes</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3 w-3" /> New Quote</Button>
      </div>
      <DataTable
        data={quotes}
        columns={[
          { key: 'quote_number', header: 'Quote #', render: (q) => <span className="text-xs font-mono font-semibold">{q.quote_number}</span> },
          { key: 'customer_id', header: 'Customer', render: (q) => { const c = getCustomer(q.customer_id); return <span className="text-xs">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>; } },
          { key: 'vehicle_id', header: 'Vehicle', render: (q) => { const v = getVehicle(q.vehicle_id); return <span className="text-xs font-mono">{v?.license_plate || '—'}</span>; } },
          { key: 'total', header: 'Total', render: (q) => <span className="text-xs font-mono tabular-nums font-medium">€{q.total.toFixed(2)}</span> },
          { key: 'validity_date', header: 'Valid Until', render: (q) => <span className="text-xs font-mono">{new Date(q.validity_date).toLocaleDateString('nl-NL')}</span> },
          { key: 'status', header: 'Status', render: (q) => <StatusBadge status={q.status} /> },
        ]}
        searchFields={['quote_number']}
        searchPlaceholder="Search quotes..."
      />
    </div>
  );
}
