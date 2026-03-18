import { useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import { CustomerDetail } from '@/components/CustomerDetail';
import { SimpleFormDialog } from '@/components/workshop/SimpleFormDialog';
import { useWorkshopStore } from '@/context/WorkshopContext';

export default function CustomersPage() {
  const { addCustomer, customers, getInvoicesForCustomer, getVehiclesForCustomer, updateCustomer } = useWorkshopStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedCustomer = useMemo(() => customers.find((item) => item.id === selectedId) || null, [customers, selectedId]);
  const editingCustomer = customers.find((item) => item.id === editingId);

  return (
    <div className="flex h-full">
      <div className={`flex-1 p-4 ${selectedCustomer ? 'max-w-[55%]' : ''} transition-all duration-150`}>
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Customers</h1>
            <p className="text-xs text-muted-foreground">{customers.length} total customers</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCustomer && (
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => { setEditingId(selectedCustomer.id); setDialogOpen(true); }}>
                <Pencil className="h-3 w-3" /> Edit Customer
              </Button>
            )}
            <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setEditingId(null); setDialogOpen(true); }}>
              <Plus className="h-3 w-3" /> New Customer
            </Button>
          </div>
        </div>

        <DataTable
          data={customers}
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (item) => (
                <div>
                  <span className="text-xs font-medium">{item.first_name} {item.last_name}</span>
                  {item.company_name && <span className="text-2xs text-muted-foreground ml-1.5">({item.company_name})</span>}
                </div>
              ),
            },
            { key: 'type', header: 'Type', render: (item) => <StatusBadge status={item.type === 'business' ? 'connected' : 'normal'} /> },
            { key: 'phone', header: 'Phone', render: (item) => <span className="text-xs font-mono">{item.phone}</span> },
            { key: 'email', header: 'Email', render: (item) => <span className="text-xs">{item.email}</span> },
            { key: 'city', header: 'City', render: (item) => <span className="text-xs">{item.city || '—'}</span> },
            { key: 'vehicles', header: 'Vehicles', render: (item) => <span className="text-xs tabular-nums">{getVehiclesForCustomer(item.id).length}</span> },
            { key: 'balance', header: 'Open Balance', render: (item) => <span className="text-xs font-mono">€{getInvoicesForCustomer(item.id).reduce((sum, invoice) => sum + invoice.balance_due, 0).toFixed(2)}</span> },
          ]}
          onRowClick={(item) => setSelectedId(item.id === selectedId ? null : item.id)}
          searchFields={['first_name', 'last_name', 'company_name', 'phone', 'email', 'city']}
          searchPlaceholder="Search customers..."
        />
      </div>

      {selectedCustomer && (
        <div className="w-[45%] border-l bg-card overflow-y-auto scrollbar-thin animate-slide-in-right">
          <CustomerDetail customer={selectedCustomer} onClose={() => setSelectedId(null)} />
        </div>
      )}

      <SimpleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingCustomer ? 'Edit customer' : 'New customer'}
        description="Create or update the main customer record."
        submitLabel={editingCustomer ? 'Save changes' : 'Create customer'}
        defaultValues={{
          type: editingCustomer?.type || 'private',
          first_name: editingCustomer?.first_name || '',
          last_name: editingCustomer?.last_name || '',
          company_name: editingCustomer?.company_name || '',
          email: editingCustomer?.email || '',
          phone: editingCustomer?.phone || '',
          city: editingCustomer?.city || '',
          marketing_opt_in: editingCustomer?.marketing_opt_in || false,
        }}
        fields={[
          { name: 'type', label: 'Customer Type', type: 'select', options: [{ label: 'Private', value: 'private' }, { label: 'Business', value: 'business' }] },
          { name: 'first_name', label: 'First Name', type: 'text' },
          { name: 'last_name', label: 'Last Name', type: 'text' },
          { name: 'company_name', label: 'Company Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'city', label: 'City', type: 'text' },
          { name: 'marketing_opt_in', label: 'Marketing Opt-in', type: 'checkbox', placeholder: 'Customer allows marketing communication' },
        ]}
        onSubmit={(values) => {
          const payload = {
            type: String(values.type || 'private') as 'private' | 'business',
            first_name: String(values.first_name || ''),
            last_name: String(values.last_name || ''),
            company_name: String(values.company_name || ''),
            email: String(values.email || ''),
            phone: String(values.phone || ''),
            city: String(values.city || ''),
            marketing_opt_in: Boolean(values.marketing_opt_in),
          };

          if (editingCustomer) {
            updateCustomer(editingCustomer.id, payload);
          } else {
            const created = addCustomer(payload);
            setSelectedId(created.id);
          }
        }}
      />
    </div>
  );
}
