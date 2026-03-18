import { useState } from 'react';
import { X, Phone, Mail, MapPin, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { useWorkshopStore } from '@/context/WorkshopContext';
import { cn } from '@/lib/utils';
import type { Customer } from '@/types';

const tabs = ['Overview', 'Vehicles', 'Work Orders', 'Invoices', 'History'];

export function CustomerDetail({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const { auditLogs, getAppointmentsForCustomer, getInvoicesForCustomer, getVehiclesForCustomer, getWorkOrdersForCustomer } = useWorkshopStore();
  const vehicles = getVehiclesForCustomer(customer.id);
  const workOrders = getWorkOrdersForCustomer(customer.id);
  const invoices = getInvoicesForCustomer(customer.id);
  const appointments = getAppointmentsForCustomer(customer.id);
  const history = auditLogs.filter((log) => ['customer', 'vehicle', 'work_order', 'invoice'].includes(log.entity_type)).slice(0, 8);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-sm font-semibold">{customer.first_name} {customer.last_name}</h2>
          {customer.company_name && <p className="text-xs text-muted-foreground">{customer.company_name}</p>}
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex border-b px-4 gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-2 text-xs font-medium border-b-2 transition-fast whitespace-nowrap',
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon={Phone} label="Phone" value={customer.phone || '—'} mono />
              <InfoItem icon={Mail} label="Email" value={customer.email || '—'} />
              <InfoItem icon={MapPin} label="Address" value={[customer.address, customer.postal_code, customer.city].filter(Boolean).join(', ') || '—'} />
              <InfoItem icon={Car} label="Vehicles" value={String(vehicles.length)} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Work Orders" value={workOrders.length} />
                <MiniStat label="Invoices" value={invoices.length} />
                <MiniStat label="Appointments" value={appointments.length} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'Vehicles' && (
          <div className="space-y-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-md p-3 hover:bg-muted/50 transition-fast">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold">{vehicle.license_plate}</span>
                  {vehicle.apk_expiry && <span className="text-2xs text-muted-foreground">APK: {new Date(vehicle.apk_expiry).toLocaleDateString('nl-NL')}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{vehicle.make} {vehicle.model} ({vehicle.year}) — {vehicle.mileage.toLocaleString()} km</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Work Orders' && (
          <div className="space-y-2">
            {workOrders.map((workOrder) => (
              <div key={workOrder.id} className="border rounded-md p-3 hover:bg-muted/50 transition-fast">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-medium">{workOrder.work_order_number}</span>
                  <StatusBadge status={workOrder.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{workOrder.intake_notes || 'No notes'}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Invoices' && (
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-md p-3 hover:bg-muted/50 transition-fast">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-medium">{invoice.invoice_number}</span>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">€{invoice.total.toFixed(2)}</span>
                  {invoice.balance_due > 0 && <span className="text-xs font-medium text-destructive">Due: €{invoice.balance_due.toFixed(2)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'History' && (
          <div className="space-y-2">
            {history.map((log) => (
              <div key={log.id} className="border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary">{log.action}</span>
                  <span className="text-2xs text-muted-foreground">{log.entity_type}/{log.entity_id}</span>
                  <span className="ml-auto text-2xs text-muted-foreground">{new Date(log.timestamp).toLocaleString('nl-NL')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-2xs text-muted-foreground">{label}</p>
        <p className={cn('text-xs', mono && 'font-mono')}>{value}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/50 rounded p-2 text-center">
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-2xs text-muted-foreground">{label}</p>
    </div>
  );
}
