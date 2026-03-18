import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SimpleFormDialog } from '@/components/workshop/SimpleFormDialog';
import { fromDateInputValue, toDateInputValue, useWorkshopStore } from '@/context/WorkshopContext';

export default function VehiclesPage() {
  const { addVehicle, customers, getCustomer, updateVehicle, vehicles } = useWorkshopStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingVehicle = vehicles.find((item) => item.id === editingId);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Vehicles</h1>
          <p className="text-xs text-muted-foreground">{vehicles.length} registered vehicles</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => { setEditingId(null); setDialogOpen(true); }}>
          <Plus className="h-3 w-3" /> Add Vehicle
        </Button>
      </div>

      <DataTable
        data={vehicles}
        columns={[
          { key: 'license_plate', header: 'Plate', render: (item) => <span className="text-xs font-mono font-semibold">{item.license_plate}</span> },
          { key: 'make', header: 'Make/Model', render: (item) => <span className="text-xs">{item.make} {item.model}</span> },
          { key: 'year', header: 'Year', render: (item) => <span className="text-xs tabular-nums">{item.year}</span> },
          { key: 'customer_id', header: 'Owner', render: (item) => <span className="text-xs">{getCustomer(item.customer_id)?.first_name} {getCustomer(item.customer_id)?.last_name}</span> },
          { key: 'mileage', header: 'Mileage', render: (item) => <span className="text-xs font-mono tabular-nums">{item.mileage.toLocaleString()} km</span> },
          { key: 'fuel_type', header: 'Fuel', render: (item) => <span className="text-xs capitalize">{item.fuel_type}</span> },
          { key: 'apk_expiry', header: 'APK', render: (item) => <span className="text-xs font-mono">{item.apk_expiry ? new Date(item.apk_expiry).toLocaleDateString('nl-NL') : '—'}</span> },
        ]}
        onRowClick={(item) => { setEditingId(item.id); setDialogOpen(true); }}
        searchFields={['license_plate', 'make', 'model', 'vin']}
        searchPlaceholder="Search by plate, make, model..."
      />

      <SimpleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingVehicle ? 'Edit vehicle' : 'Add vehicle'}
        description="Update the vehicle record and expiry details."
        submitLabel={editingVehicle ? 'Save vehicle' : 'Create vehicle'}
        defaultValues={{
          customer_id: editingVehicle?.customer_id || customers[0]?.id || '',
          license_plate: editingVehicle?.license_plate || '',
          make: editingVehicle?.make || '',
          model: editingVehicle?.model || '',
          year: editingVehicle?.year || new Date().getFullYear(),
          mileage: editingVehicle?.mileage || 0,
          fuel_type: editingVehicle?.fuel_type || 'petrol',
          transmission: editingVehicle?.transmission || 'manual',
          apk_expiry: toDateInputValue(editingVehicle?.apk_expiry),
        }}
        fields={[
          { name: 'customer_id', label: 'Owner', type: 'select', options: customers.map((item) => ({ label: `${item.first_name} ${item.last_name}`, value: item.id })) },
          { name: 'license_plate', label: 'License Plate', type: 'text' },
          { name: 'make', label: 'Make', type: 'text' },
          { name: 'model', label: 'Model', type: 'text' },
          { name: 'year', label: 'Year', type: 'number' },
          { name: 'mileage', label: 'Mileage', type: 'number' },
          { name: 'fuel_type', label: 'Fuel Type', type: 'select', options: ['petrol', 'diesel', 'electric', 'hybrid'].map((value) => ({ label: value, value })) },
          { name: 'transmission', label: 'Transmission', type: 'select', options: ['manual', 'automatic', 'cvt'].map((value) => ({ label: value, value })) },
          { name: 'apk_expiry', label: 'APK Expiry', type: 'date' },
        ]}
        onSubmit={(values) => {
          const payload = {
            customer_id: String(values.customer_id || customers[0]?.id || ''),
            license_plate: String(values.license_plate || ''),
            make: String(values.make || ''),
            model: String(values.model || ''),
            year: Number(values.year || 0),
            mileage: Number(values.mileage || 0),
            fuel_type: String(values.fuel_type || 'petrol') as 'petrol' | 'diesel' | 'electric' | 'hybrid',
            transmission: String(values.transmission || 'manual') as 'manual' | 'automatic' | 'cvt',
            apk_expiry: values.apk_expiry ? fromDateInputValue(String(values.apk_expiry)) : undefined,
          };

          if (editingVehicle) {
            updateVehicle(editingVehicle.id, payload);
          } else {
            addVehicle(payload);
          }
        }}
      />
    </div>
  );
}
