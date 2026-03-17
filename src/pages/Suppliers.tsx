import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { suppliers } from '@/data/demo';

export default function SuppliersPage() {
  return (
    <div className="p-4">
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-foreground">Suppliers</h1>
        <p className="text-xs text-muted-foreground">{suppliers.length} suppliers</p>
      </div>
      <DataTable
        data={suppliers}
        columns={[
          { key: 'name', header: 'Name', render: (s) => <span className="text-xs font-medium">{s.name}</span> },
          { key: 'contact_name', header: 'Contact', render: (s) => <span className="text-xs">{s.contact_name || '—'}</span> },
          { key: 'email', header: 'Email', render: (s) => <span className="text-xs">{s.email || '—'}</span> },
          { key: 'phone', header: 'Phone', render: (s) => <span className="text-xs font-mono">{s.phone || '—'}</span> },
          { key: 'ordering_method', header: 'Order Method', render: (s) => <span className="text-xs">{s.ordering_method || '—'}</span> },
          { key: 'delivery_terms', header: 'Delivery', render: (s) => <span className="text-xs text-muted-foreground">{s.delivery_terms || '—'}</span> },
          { key: 'connection_status', header: 'Status', render: (s) => <StatusBadge status={s.connection_status} /> },
        ]}
        searchFields={['name', 'contact_name', 'email']}
        searchPlaceholder="Search suppliers..."
      />
    </div>
  );
}
