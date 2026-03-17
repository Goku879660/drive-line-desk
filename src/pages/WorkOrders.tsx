import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { workOrders, getCustomer, getVehicle, getTeamMember } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WorkOrdersPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Work Orders</h1>
          <p className="text-xs text-muted-foreground">{workOrders.length} total work orders</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3 w-3" /> New Work Order</Button>
      </div>
      <DataTable
        data={workOrders}
        columns={[
          { key: 'work_order_number', header: 'WO #', render: (wo) => <span className="text-xs font-mono font-semibold">{wo.work_order_number}</span> },
          { key: 'customer_id', header: 'Customer', render: (wo) => { const c = getCustomer(wo.customer_id); return <span className="text-xs">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>; } },
          { key: 'vehicle_id', header: 'Vehicle', render: (wo) => { const v = getVehicle(wo.vehicle_id); return <span className="text-xs font-mono">{v?.license_plate || '—'}</span>; } },
          { key: 'priority', header: 'Priority', render: (wo) => <StatusBadge status={wo.priority} /> },
          { key: 'status', header: 'Status', render: (wo) => <StatusBadge status={wo.status} /> },
          { key: 'assigned_technician_id', header: 'Technician', render: (wo) => { const t = wo.assigned_technician_id ? getTeamMember(wo.assigned_technician_id) : null; return <span className="text-xs">{t ? `${t.first_name} ${t.last_name}` : '—'}</span>; } },
          { key: 'intake_notes', header: 'Notes', render: (wo) => <span className="text-xs text-muted-foreground truncate max-w-[200px] block">{wo.intake_notes || '—'}</span> },
        ]}
        searchFields={['work_order_number', 'intake_notes']}
        searchPlaceholder="Search work orders..."
      />
    </div>
  );
}
