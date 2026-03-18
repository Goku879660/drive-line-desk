import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { fromDateTimeLocalValue, toDateTimeLocalValue, useWorkshopStore } from '@/context/WorkshopContext';
import { SimpleFormDialog } from '@/components/workshop/SimpleFormDialog';

export default function AppointmentsPage() {
  const { addAppointment, appointments, customers, getCustomer, getVehicle, updateAppointment, vehicles } = useWorkshopStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingAppointment = appointments.find((item) => item.id === editingId);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Appointments</h1>
          <p className="text-xs text-muted-foreground">{appointments.length} appointments</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setEditingId(null); setDialogOpen(true); }}>
          <Plus className="h-3 w-3" /> New Appointment
        </Button>
      </div>

      <DataTable
        data={appointments}
        columns={[
          { key: 'scheduled_start', header: 'Date/Time', render: (item) => <span className="text-xs font-mono tabular-nums">{new Date(item.scheduled_start).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span> },
          { key: 'customer_id', header: 'Customer', render: (item) => <span className="text-xs">{getCustomer(item.customer_id)?.first_name} {getCustomer(item.customer_id)?.last_name}</span> },
          { key: 'vehicle_id', header: 'Vehicle', render: (item) => <span className="text-xs font-mono">{getVehicle(item.vehicle_id)?.license_plate || '—'}</span> },
          { key: 'appointment_type', header: 'Type', render: (item) => <span className="text-xs">{item.appointment_type}</span> },
          { key: 'complaint_description', header: 'Description', render: (item) => <span className="text-xs text-muted-foreground truncate max-w-[250px] block">{item.complaint_description || '—'}</span> },
          { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
        ]}
        onRowClick={(item) => { setEditingId(item.id); setDialogOpen(true); }}
        searchFields={['appointment_type', 'complaint_description']}
        searchPlaceholder="Search appointments..."
      />

      <SimpleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingAppointment ? 'Edit appointment' : 'New appointment'}
        description="Plan and update the booking slot."
        submitLabel={editingAppointment ? 'Save appointment' : 'Create appointment'}
        defaultValues={{
          customer_id: editingAppointment?.customer_id || customers[0]?.id || '',
          vehicle_id: editingAppointment?.vehicle_id || vehicles[0]?.id || '',
          appointment_type: editingAppointment?.appointment_type || 'Service',
          complaint_description: editingAppointment?.complaint_description || '',
          scheduled_start: toDateTimeLocalValue(editingAppointment?.scheduled_start),
          scheduled_end: toDateTimeLocalValue(editingAppointment?.scheduled_end),
          status: editingAppointment?.status || 'planned',
        }}
        fields={[
          { name: 'customer_id', label: 'Customer', type: 'select', options: customers.map((item) => ({ label: `${item.first_name} ${item.last_name}`, value: item.id })) },
          { name: 'vehicle_id', label: 'Vehicle', type: 'select', options: vehicles.map((item) => ({ label: `${item.license_plate} — ${item.make} ${item.model}`, value: item.id })) },
          { name: 'appointment_type', label: 'Type', type: 'text' },
          { name: 'complaint_description', label: 'Complaint', type: 'textarea' },
          { name: 'scheduled_start', label: 'Start', type: 'datetime-local' },
          { name: 'scheduled_end', label: 'End', type: 'datetime-local' },
          { name: 'status', label: 'Status', type: 'select', options: ['planned', 'confirmed', 'arrived', 'in_progress', 'completed', 'no_show', 'cancelled'].map((value) => ({ label: value, value })) },
        ]}
        onSubmit={(values) => {
          const payload = {
            customer_id: String(values.customer_id || customers[0]?.id || ''),
            vehicle_id: String(values.vehicle_id || vehicles[0]?.id || ''),
            appointment_type: String(values.appointment_type || 'Service'),
            complaint_description: String(values.complaint_description || ''),
            scheduled_start: fromDateTimeLocalValue(String(values.scheduled_start || '')),
            scheduled_end: fromDateTimeLocalValue(String(values.scheduled_end || '')),
            status: String(values.status || 'planned') as 'planned' | 'confirmed' | 'arrived' | 'in_progress' | 'completed' | 'no_show' | 'cancelled',
          };

          if (editingAppointment) {
            updateAppointment(editingAppointment.id, payload);
          } else {
            addAppointment(payload);
          }
        }}
      />
    </div>
  );
}
