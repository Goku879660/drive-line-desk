import { Customer } from '@/types';
import { X, Phone, Mail, MapPin, Car, FileText, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { getVehiclesForCustomer, getWorkOrdersForCustomer, getInvoicesForCustomer, getAppointmentsForCustomer } from '@/data/demo';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = ['Overview', 'Vehicles', 'Work Orders', 'Invoices', 'History'];

export function CustomerDetail({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const vehicles = getVehiclesForCustomer(customer.id);
  const workOrders = getWorkOrdersForCustomer(customer.id);
  const invoicesData = getInvoicesForCustomer(customer.id);
  const appointments = getAppointmentsForCustomer(customer.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-sm font-semibold">{customer.first_name} {customer.last_name}</h2>
          {customer.company_name && <p className="text-xs text-muted-foreground">{customer.company_name}</p>}
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b px-4 gap-0">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "px-3 py-2 text-xs font-medium border-b-2 transition-fast",
              activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <InfoItem icon={Phone} label="Phone" value={customer.phone} mono />
              <InfoItem icon={Mail} label="Email" value={customer.email} />
              <InfoItem icon={MapPin} label="Address" value={[customer.address, customer.postal_code, customer.city].filter(Boolean).join(', ') || '—'} />
              <InfoItem icon={Car} label="Vehicles" value={String(vehicles.length)} />
            </div>
            {customer.vat_number && (
              <div className="text-xs">
                <span className="text-muted-foreground">VAT:</span>{' '}
                <span className="font-mono">{customer.vat_number}</span>
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Work Orders" value={workOrders.length} />
                <MiniStat label="Invoices" value={invoicesData.length} />
                <MiniStat label="Appointments" value={appointments.length} />
              </div>
            </div>
          </>
        )}
        {activeTab === 'Vehicles' && (
          <div className="space-y-2">
            {vehicles.map(v => (
              <div key={v.id} className="border rounded-md p-3 hover:bg-muted/50 transition-fast cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold">{v.license_plate}</span>
                  {v.apk_expiry && <span className="text-2xs text-muted-foreground">APK: {new Date(v.apk_expiry).toLocaleDateString('nl-NL')}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{v.make} {v.model} ({v.year}) — {v.mileage.toLocaleString()} km</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'Work Orders' && (
          <div className="space-y-2">
            {workOrders.map(wo => (
              <div key={wo.id} className="border rounded-md p-3 hover:bg-muted/50 transition-fast cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium">{wo.work_order_number}</span>
                  <StatusBadge status={wo.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{wo.intake_notes || 'No notes'}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'Invoices' && (
          <div className="space-y-2">
            {invoicesData.map(inv => (
              <div key={inv.id} className="border rounded-md p-3 hover:bg-muted/50 transition-fast cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium">{inv.invoice_number}</span>
                  <StatusBadge status={inv.status} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">€{inv.total.toFixed(2)}</span>
                  {inv.balance_due > 0 && <span className="text-xs font-medium text-destructive">Due: €{inv.balance_due.toFixed(2)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'History' && (
          <p className="text-xs text-muted-foreground py-4 text-center">Activity timeline coming soon</p>
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
        <p className={cn("text-xs", mono && "font-mono")}>{value}</p>
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
