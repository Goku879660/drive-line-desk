import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { customers, getVehiclesForCustomer, getWorkOrdersForCustomer, getInvoicesForCustomer } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CustomerDetail } from '@/components/CustomerDetail';

export default function CustomersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const customer = selected ? customers.find(c => c.id === selected) : null;

  return (
    <div className="flex h-full">
      <div className={`flex-1 p-4 ${selected ? 'max-w-[55%]' : ''} transition-all duration-150`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Customers</h1>
            <p className="text-xs text-muted-foreground">{customers.length} total customers</p>
          </div>
          <Button size="sm" className="h-8 text-xs gap-1.5">
            <Plus className="h-3 w-3" /> New Customer
          </Button>
        </div>
        <DataTable
          data={customers}
          columns={[
            { key: 'name', header: 'Name', render: (c) => (
              <div>
                <span className="text-xs font-medium">{c.first_name} {c.last_name}</span>
                {c.company_name && <span className="text-2xs text-muted-foreground ml-1.5">({c.company_name})</span>}
              </div>
            )},
            { key: 'type', header: 'Type', render: (c) => <StatusBadge status={c.type === 'business' ? 'connected' : 'normal'} /> },
            { key: 'phone', header: 'Phone', render: (c) => <span className="text-xs font-mono">{c.phone}</span> },
            { key: 'email', header: 'Email', render: (c) => <span className="text-xs">{c.email}</span> },
            { key: 'city', header: 'City', render: (c) => <span className="text-xs">{c.city || '—'}</span> },
            { key: 'vehicles', header: 'Vehicles', render: (c) => <span className="text-xs tabular-nums">{getVehiclesForCustomer(c.id).length}</span> },
          ]}
          onRowClick={(c) => setSelected(c.id === selected ? null : c.id)}
          searchFields={['first_name', 'last_name', 'company_name', 'phone', 'email', 'city']}
          searchPlaceholder="Search customers..."
        />
      </div>
      {customer && (
        <div className="w-[45%] border-l bg-card overflow-y-auto scrollbar-thin animate-slide-in-right">
          <CustomerDetail customer={customer} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
