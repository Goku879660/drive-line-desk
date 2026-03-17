import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { appointments, getCustomer, getVehicle } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Appointments</h1>
          <p className="text-xs text-muted-foreground">{appointments.length} appointments</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3 w-3" /> New Appointment</Button>
      </div>
      <DataTable
        data={appointments}
        columns={[
          { key: 'scheduled_start', header: 'Date/Time', render: (a) => <span className="text-xs font-mono tabular-nums">{new Date(a.scheduled_start).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span> },
          { key: 'customer_id', header: 'Customer', render: (a) => { const c = getCustomer(a.customer_id); return <span className="text-xs">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>; } },
          { key: 'vehicle_id', header: 'Vehicle', render: (a) => { const v = getVehicle(a.vehicle_id); return <span className="text-xs font-mono">{v?.license_plate || '—'}</span>; } },
          { key: 'appointment_type', header: 'Type', render: (a) => <span className="text-xs">{a.appointment_type}</span> },
          { key: 'complaint_description', header: 'Description', render: (a) => <span className="text-xs text-muted-foreground truncate max-w-[250px] block">{a.complaint_description || '—'}</span> },
          { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
        ]}
        searchFields={['appointment_type', 'complaint_description']}
        searchPlaceholder="Search appointments..."
      />
    </div>
  );
}
