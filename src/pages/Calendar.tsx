import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { fromDateTimeLocalValue, toDateTimeLocalValue, useWorkshopStore } from '@/context/WorkshopContext';
import { SimpleFormDialog } from '@/components/workshop/SimpleFormDialog';

const hours = Array.from({ length: 10 }, (_, index) => index + 8);

export default function CalendarPage() {
  const { addAppointment, appointments, customers, getCustomer, getVehicle, updateAppointment, vehicles } = useWorkshopStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const today = new Date();

  const todayAppts = useMemo(
    () => appointments.filter((item) => new Date(item.scheduled_start).toDateString() === today.toDateString()),
    [appointments, today]
  );

  const editingAppointment = appointments.find((item) => item.id === editingId);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Planning</h1>
          <p className="text-xs text-muted-foreground">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setEditingId(null); setDialogOpen(true); }}>
          <Plus className="h-3 w-3" /> Add Appointment
        </Button>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <div className="grid grid-cols-[60px_1fr] divide-x">
          <div className="divide-y">
            {hours.map((hour) => (
              <div key={hour} className="h-16 flex items-start justify-end pr-2 pt-1">
                <span className="text-2xs font-mono text-muted-foreground tabular-nums">{String(hour).padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>
          <div className="relative divide-y min-h-[640px]">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-border" />
            ))}

            {todayAppts.map((item) => {
              const start = new Date(item.scheduled_start);
              const end = new Date(item.scheduled_end);
              const startH = start.getHours() + start.getMinutes() / 60;
              const endH = end.getHours() + end.getMinutes() / 60;
              const top = (startH - 8) * 64;
              const height = (endH - startH) * 64;
              const customer = getCustomer(item.customer_id);
              const vehicle = getVehicle(item.vehicle_id);

              return (
                <button
                  key={item.id}
                  className={cn(
                    'absolute left-1 right-2 rounded border px-2 py-1 text-left transition-fast hover:shadow-md overflow-hidden',
                    item.status === 'arrived' && 'bg-accent border-border',
                    item.status === 'confirmed' && 'bg-secondary border-border',
                    item.status === 'completed' && 'bg-muted border-border',
                    !['arrived', 'confirmed', 'completed'].includes(item.status) && 'bg-background border-border'
                  )}
                  style={{ top: `${top}px`, height: `${Math.max(height, 32)}px` }}
                  onClick={() => { setEditingId(item.id); setDialogOpen(true); }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xs font-mono tabular-nums">{start.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-xs font-medium truncate">{customer ? `${customer.first_name} ${customer.last_name}` : '—'}</span>
                    <StatusBadge status={item.status} className="ml-auto text-2xs" />
                  </div>
                  {height > 36 && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-2xs font-mono">{vehicle?.license_plate}</span>
                      <span className="text-2xs text-muted-foreground truncate">— {item.appointment_type}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <SimpleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingAppointment ? 'Update appointment in planning' : 'Add appointment to planning'}
        description="Change slot timing, vehicle assignment and planning status."
        submitLabel={editingAppointment ? 'Save planning item' : 'Create planning item'}
        defaultValues={{
          customer_id: editingAppointment?.customer_id || customers[0]?.id || '',
          vehicle_id: editingAppointment?.vehicle_id || vehicles[0]?.id || '',
          appointment_type: editingAppointment?.appointment_type || 'Service',
          scheduled_start: toDateTimeLocalValue(editingAppointment?.scheduled_start),
          scheduled_end: toDateTimeLocalValue(editingAppointment?.scheduled_end),
          status: editingAppointment?.status || 'planned',
          complaint_description: editingAppointment?.complaint_description || '',
        }}
        fields={[
          { name: 'customer_id', label: 'Customer', type: 'select', options: customers.map((item) => ({ label: `${item.first_name} ${item.last_name}`, value: item.id })) },
          { name: 'vehicle_id', label: 'Vehicle', type: 'select', options: vehicles.map((item) => ({ label: `${item.license_plate} — ${item.make} ${item.model}`, value: item.id })) },
          { name: 'appointment_type', label: 'Type', type: 'text' },
          { name: 'scheduled_start', label: 'Start', type: 'datetime-local' },
          { name: 'scheduled_end', label: 'End', type: 'datetime-local' },
          { name: 'status', label: 'Status', type: 'select', options: ['planned', 'confirmed', 'arrived', 'in_progress', 'completed', 'no_show', 'cancelled'].map((value) => ({ label: value, value })) },
          { name: 'complaint_description', label: 'Complaint', type: 'textarea' },
        ]}
        onSubmit={(values) => {
          const payload = {
            customer_id: String(values.customer_id || customers[0]?.id || ''),
            vehicle_id: String(values.vehicle_id || vehicles[0]?.id || ''),
            appointment_type: String(values.appointment_type || 'Service'),
            scheduled_start: fromDateTimeLocalValue(String(values.scheduled_start || '')),
            scheduled_end: fromDateTimeLocalValue(String(values.scheduled_end || '')),
            status: String(values.status || 'planned') as any,
            complaint_description: String(values.complaint_description || ''),
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
