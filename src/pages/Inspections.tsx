import { inspections, getVehicle, workOrders } from '@/data/demo';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function InspectionsPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Inspections / MOT / Checklists</h1>
          <p className="text-xs text-muted-foreground">{inspections.length} inspection records</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3 w-3" /> New Inspection</Button>
      </div>
      <div className="space-y-3">
        {inspections.map(insp => {
          const v = getVehicle(insp.vehicle_id);
          const wo = insp.work_order_id ? workOrders.find(w => w.id === insp.work_order_id) : null;
          return (
            <div key={insp.id} className="border rounded-md bg-card p-4 hover:shadow-sm transition-fast cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold">{v?.license_plate}</span>
                  <span className="text-xs text-muted-foreground">{v?.make} {v?.model}</span>
                </div>
                <StatusBadge status={insp.result} />
              </div>
              {wo && <p className="text-xs text-muted-foreground mb-2">Linked to {wo.work_order_number}</p>}
              {insp.defects.length > 0 && (
                <div className="mb-1">
                  <span className="text-2xs font-medium text-destructive uppercase tracking-wide">Defects:</span>
                  <ul className="mt-0.5 space-y-0.5">{insp.defects.map((d, i) => <li key={i} className="text-xs text-foreground">• {d}</li>)}</ul>
                </div>
              )}
              {insp.advisories.length > 0 && (
                <div>
                  <span className="text-2xs font-medium text-warning uppercase tracking-wide">Advisories:</span>
                  <ul className="mt-0.5 space-y-0.5">{insp.advisories.map((a, i) => <li key={i} className="text-xs text-muted-foreground">• {a}</li>)}</ul>
                </div>
              )}
              <p className="text-2xs text-muted-foreground mt-2">{new Date(insp.created_at).toLocaleDateString('nl-NL')}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
