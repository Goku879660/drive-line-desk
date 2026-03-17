import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { vehicles, getCustomer } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function VehiclesPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Vehicles</h1>
          <p className="text-xs text-muted-foreground">{vehicles.length} registered vehicles</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3 w-3" /> Add Vehicle</Button>
      </div>
      <DataTable
        data={vehicles}
        columns={[
          { key: 'license_plate', header: 'Plate', render: (v) => <span className="text-xs font-mono font-semibold">{v.license_plate}</span> },
          { key: 'make', header: 'Make/Model', render: (v) => <span className="text-xs">{v.make} {v.model}</span> },
          { key: 'year', header: 'Year', render: (v) => <span className="text-xs tabular-nums">{v.year}</span> },
          { key: 'customer_id', header: 'Owner', render: (v) => { const c = getCustomer(v.customer_id); return <span className="text-xs">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>; } },
          { key: 'mileage', header: 'Mileage', render: (v) => <span className="text-xs font-mono tabular-nums">{v.mileage.toLocaleString()} km</span> },
          { key: 'fuel_type', header: 'Fuel', render: (v) => <span className="text-xs capitalize">{v.fuel_type}</span> },
          { key: 'apk_expiry', header: 'APK', render: (v) => {
            if (!v.apk_expiry) return <span className="text-xs text-muted-foreground">—</span>;
            const days = Math.ceil((new Date(v.apk_expiry).getTime() - Date.now()) / 86400000);
            return <span className={`text-xs font-mono ${days < 0 ? 'text-destructive font-medium' : days < 30 ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
              {new Date(v.apk_expiry).toLocaleDateString('nl-NL')}
            </span>;
          }},
        ]}
        searchFields={['license_plate', 'make', 'model', 'vin']}
        searchPlaceholder="Search by plate, make, model..."
      />
    </div>
  );
}
