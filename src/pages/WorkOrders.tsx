import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SimpleFormDialog } from '@/components/workshop/SimpleFormDialog';
import { fromDateInputValue, toDateInputValue, useWorkshopStore } from '@/context/WorkshopContext';

export default function WorkOrdersPage() {
  const { addWorkOrder, customers, getCustomer, getTeamMember, getVehicle, teamMembers, updateWorkOrder, vehicles, workOrders } = useWorkshopStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingWorkOrder = workOrders.find((item) => item.id === editingId);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Work Orders</h1>
          <p className="text-xs text-muted-foreground">{workOrders.length} total work orders</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setEditingId(null); setDialogOpen(true); }}>
          <Plus className="h-3 w-3" /> New Work Order
        </Button>
      </div>

      <DataTable
        data={workOrders}
        columns={[
          { key: 'work_order_number', header: 'WO #', render: (item) => <span className="text-xs font-mono font-semibold">{item.work_order_number}</span> },
          { key: 'customer_id', header: 'Customer', render: (item) => <span className="text-xs">{getCustomer(item.customer_id)?.first_name} {getCustomer(item.customer_id)?.last_name}</span> },
          { key: 'vehicle_id', header: 'Vehicle', render: (item) => <span className="text-xs font-mono">{getVehicle(item.vehicle_id)?.license_plate || '—'}</span> },
          { key: 'priority', header: 'Priority', render: (item) => <StatusBadge status={item.priority} /> },
          { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
          { key: 'assigned_technician_id', header: 'Technician', render: (item) => <span className="text-xs">{item.assigned_technician_id ? `${getTeamMember(item.assigned_technician_id)?.first_name} ${getTeamMember(item.assigned_technician_id)?.last_name}` : '—'}</span> },
          { key: 'intake_notes', header: 'Notes', render: (item) => <span className="text-xs text-muted-foreground truncate max-w-[220px] block">{item.intake_notes || '—'}</span> },
        ]}
        onRowClick={(item) => { setEditingId(item.id); setDialogOpen(true); }}
        searchFields={['work_order_number', 'intake_notes', 'diagnosis_notes']}
        searchPlaceholder="Search work orders..."
      />

      <SimpleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingWorkOrder ? 'Edit work order' : 'New work order'}
        description="Keep the work order queue and status pipeline up to date."
        submitLabel={editingWorkOrder ? 'Save work order' : 'Create work order'}
        defaultValues={{
          work_order_number: editingWorkOrder?.work_order_number || '',
          customer_id: editingWorkOrder?.customer_id || customers[0]?.id || '',
          vehicle_id: editingWorkOrder?.vehicle_id || vehicles[0]?.id || '',
          status: editingWorkOrder?.status || 'draft',
          priority: editingWorkOrder?.priority || 'normal',
          assigned_technician_id: editingWorkOrder?.assigned_technician_id || teamMembers[0]?.id || '',
          intake_notes: editingWorkOrder?.intake_notes || '',
          diagnosis_notes: editingWorkOrder?.diagnosis_notes || '',
          promised_date: toDateInputValue(editingWorkOrder?.promised_date),
        }}
        fields={[
          { name: 'work_order_number', label: 'Work Order #', type: 'text' },
          { name: 'customer_id', label: 'Customer', type: 'select', options: customers.map((item) => ({ label: `${item.first_name} ${item.last_name}`, value: item.id })) },
          { name: 'vehicle_id', label: 'Vehicle', type: 'select', options: vehicles.map((item) => ({ label: `${item.license_plate} — ${item.make} ${item.model}`, value: item.id })) },
          { name: 'status', label: 'Status', type: 'select', options: ['draft', 'open', 'diagnosis', 'awaiting_approval', 'approved', 'parts_ordered', 'in_progress', 'waiting_external', 'completed', 'invoiced', 'closed'].map((value) => ({ label: value, value })) },
          { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'].map((value) => ({ label: value, value })) },
          { name: 'assigned_technician_id', label: 'Technician', type: 'select', options: teamMembers.map((item) => ({ label: `${item.first_name} ${item.last_name}`, value: item.id })) },
          { name: 'promised_date', label: 'Promised Date', type: 'date' },
          { name: 'intake_notes', label: 'Intake Notes', type: 'textarea' },
          { name: 'diagnosis_notes', label: 'Diagnosis Notes', type: 'textarea' },
        ]}
        onSubmit={(values) => {
          const payload = {
            work_order_number: String(values.work_order_number || ''),
            customer_id: String(values.customer_id || customers[0]?.id || ''),
            vehicle_id: String(values.vehicle_id || vehicles[0]?.id || ''),
            status: String(values.status || 'draft') as any,
            priority: String(values.priority || 'normal') as any,
            assigned_technician_id: String(values.assigned_technician_id || ''),
            promised_date: values.promised_date ? fromDateInputValue(String(values.promised_date)) : undefined,
            intake_notes: String(values.intake_notes || ''),
            diagnosis_notes: String(values.diagnosis_notes || ''),
          };

          if (editingWorkOrder) {
            updateWorkOrder(editingWorkOrder.id, payload);
          } else {
            addWorkOrder(payload);
          }
        }}
      />
    </div>
  );
}
