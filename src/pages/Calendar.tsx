import { appointments, getCustomer, getVehicle } from '@/data/demo';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8:00 - 17:00

export default function CalendarPage() {
  const today = new Date();
  const todayAppts = appointments.filter(a => {
    const d = new Date(a.scheduled_start);
    return d.toDateString() === today.toDateString();
  });

  return (
    <div className="p-4">
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-foreground">Planning</h1>
        <p className="text-xs text-muted-foreground">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        {/* Time grid */}
        <div className="grid grid-cols-[60px_1fr] divide-x">
          <div className="divide-y">
            {hours.map(h => (
              <div key={h} className="h-16 flex items-start justify-end pr-2 pt-1">
                <span className="text-2xs font-mono text-muted-foreground tabular-nums">{String(h).padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>
          <div className="relative divide-y">
            {hours.map(h => (
              <div key={h} className="h-16 border-border" />
            ))}
            {/* Appointments overlaid */}
            {todayAppts.map(a => {
              const start = new Date(a.scheduled_start);
              const end = new Date(a.scheduled_end);
              const startH = start.getHours() + start.getMinutes() / 60;
              const endH = end.getHours() + end.getMinutes() / 60;
              const top = (startH - 8) * 64; // 64px per hour
              const height = (endH - startH) * 64;
              const c = getCustomer(a.customer_id);
              const v = getVehicle(a.vehicle_id);

              return (
                <div
                  key={a.id}
                  className={cn(
                    "absolute left-1 right-2 rounded border px-2 py-1 cursor-pointer transition-fast hover:shadow-md overflow-hidden",
                    a.status === 'arrived' ? 'bg-amber-50 border-amber-300' :
                    a.status === 'confirmed' ? 'bg-blue-50 border-blue-300' :
                    a.status === 'completed' ? 'bg-emerald-50 border-emerald-300' :
                    'bg-muted border-border'
                  )}
                  style={{ top: `${top}px`, height: `${Math.max(height, 28)}px` }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xs font-mono tabular-nums">{start.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-xs font-medium truncate">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>
                    <StatusBadge status={a.status} className="ml-auto text-2xs" />
                  </div>
                  {height > 36 && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-2xs font-mono">{v?.license_plate}</span>
                      <span className="text-2xs text-muted-foreground">— {a.appointment_type}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
