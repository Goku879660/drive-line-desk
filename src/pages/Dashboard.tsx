import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { DataTable } from '@/components/DataTable';
import { useWorkshopStore } from '@/context/WorkshopContext';
import { Wrench, Calendar, Receipt, AlertTriangle, Car, CreditCard, Users, Clock, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { appointments, communications, getCustomer, getVehicle, invoices, parts, workOrders } = useWorkshopStore();

  const today = new Date().toDateString();
  const todayAppts = appointments.filter((item) => new Date(item.scheduled_start).toDateString() === today);
  const activeWOs = workOrders.filter((item) => !['closed', 'invoiced'].includes(item.status));
  const overdueInvoices = invoices.filter((item) => item.status === 'overdue');
  const lowStockParts = parts.filter((item) => item.stock_quantity <= item.min_stock_level);
  const vehiclesExpiring = appointments
    .map((appointment) => getVehicle(appointment.vehicle_id))
    .filter(Boolean)
    .filter((vehicle, index, self) => self.findIndex((item) => item?.id === vehicle?.id) === index)
    .filter((vehicle) => {
      if (!vehicle?.apk_expiry) return false;
      const inDays = (new Date(vehicle.apk_expiry).getTime() - Date.now()) / 86400000;
      return inDays <= 30 && inDays > -90;
    });
  const revenueToday = invoices.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.total, 0);
  const readyForPickup = workOrders.filter((item) => item.status === 'completed' || item.status === 'invoiced');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Workshop overview for today</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => navigate('/appointments')}>
            <Calendar className="h-3 w-3" /> View planning
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => navigate('/work-orders')}>
            <ClipboardList className="h-3 w-3" /> Open queue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        <KPICard title="Today's Appts" value={todayAppts.length} icon={Calendar} subtitle={`${todayAppts.filter((item) => item.status === 'confirmed').length} confirmed`} />
        <KPICard title="Active WOs" value={activeWOs.length} icon={Wrench} subtitle={`${activeWOs.filter((item) => item.priority === 'urgent').length} urgent`} variant={activeWOs.some((item) => item.priority === 'urgent') ? 'danger' : 'default'} />
        <KPICard title="Overdue Invoices" value={overdueInvoices.length} icon={Receipt} subtitle={`€${overdueInvoices.reduce((sum, item) => sum + item.balance_due, 0).toFixed(0)}`} variant={overdueInvoices.length > 0 ? 'danger' : 'default'} />
        <KPICard title="Low Stock" value={lowStockParts.length} icon={AlertTriangle} variant={lowStockParts.length > 0 ? 'warning' : 'default'} />
        <KPICard title="APK Expiring" value={vehiclesExpiring.length} icon={Car} subtitle="Within 30 days" variant={vehiclesExpiring.length > 0 ? 'warning' : 'default'} />
        <KPICard title="Revenue (Paid)" value={`€${revenueToday.toFixed(0)}`} icon={CreditCard} variant="success" />
        <KPICard title="Customers" value={new Set(appointments.map((item) => item.customer_id)).size} icon={Users} subtitle="active in current schedule" />
        <KPICard title="Ready Pickup" value={readyForPickup.length} icon={Clock} subtitle="completed or invoiced" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Today's Appointments</h2>
          <DataTable
            data={todayAppts}
            columns={[
              { key: 'scheduled_start', header: 'Time', render: (item) => <span className="text-xs font-mono tabular-nums">{new Date(item.scheduled_start).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span> },
              { key: 'customer_id', header: 'Customer', render: (item) => <span className="text-xs font-medium">{getCustomer(item.customer_id)?.first_name} {getCustomer(item.customer_id)?.last_name}</span> },
              { key: 'vehicle_id', header: 'Vehicle', render: (item) => <span className="text-xs font-mono">{getVehicle(item.vehicle_id)?.license_plate || '—'}</span> },
              { key: 'appointment_type', header: 'Type', render: (item) => <span className="text-xs">{item.appointment_type}</span> },
              { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            ]}
            onRowClick={() => navigate('/appointments')}
            searchFields={['appointment_type']}
            searchPlaceholder="Search appointments..."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Active Work Orders</h2>
          <DataTable
            data={activeWOs}
            columns={[
              { key: 'work_order_number', header: 'WO #', render: (item) => <span className="text-xs font-mono font-medium">{item.work_order_number}</span> },
              { key: 'customer_id', header: 'Customer', render: (item) => <span className="text-xs">{getCustomer(item.customer_id)?.first_name} {getCustomer(item.customer_id)?.last_name}</span> },
              { key: 'vehicle_id', header: 'Vehicle', render: (item) => <span className="text-xs font-mono">{getVehicle(item.vehicle_id)?.license_plate || '—'}</span> },
              { key: 'priority', header: 'Priority', render: (item) => <StatusBadge status={item.priority} /> },
              { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            ]}
            onRowClick={() => navigate('/work-orders')}
            searchFields={['work_order_number', 'intake_notes']}
            searchPlaceholder="Search work orders..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Recent Communications</h2>
          <div className="border rounded-md bg-card divide-y">
            {communications.slice(0, 5).map((item) => {
              const customer = getCustomer(item.customer_id);
              return (
                <button key={item.id} className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-fast" onClick={() => navigate('/communications')}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.channel} />
                    <span className="text-xs font-medium truncate">{customer ? `${customer.first_name} ${customer.last_name}` : '—'}</span>
                    <span className="text-2xs text-muted-foreground ml-auto">{new Date(item.timestamp).toLocaleDateString('nl-NL')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.subject}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Low Stock Alerts</h2>
          <div className="border rounded-md bg-card divide-y">
            {lowStockParts.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">All stock levels OK</div>
            ) : (
              lowStockParts.map((item) => (
                <button key={item.id} className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-fast" onClick={() => navigate('/parts')}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{item.description}</span>
                    <span className="text-xs font-mono font-medium">{item.stock_quantity}/{item.min_stock_level}</span>
                  </div>
                  <span className="text-2xs text-muted-foreground font-mono">{item.sku}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">APK Expiring Soon</h2>
          <div className="border rounded-md bg-card divide-y">
            {vehiclesExpiring.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">No APK expiring soon</div>
            ) : (
              vehiclesExpiring.map((vehicle) => {
                const customer = vehicle ? getCustomer(vehicle.customer_id) : undefined;
                const daysLeft = vehicle?.apk_expiry ? Math.ceil((new Date(vehicle.apk_expiry).getTime() - Date.now()) / 86400000) : 0;
                return vehicle ? (
                  <button key={vehicle.id} className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-fast" onClick={() => navigate('/vehicles')}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium">{vehicle.license_plate}</span>
                      <span className="text-xs font-medium">{daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}</span>
                    </div>
                    <p className="text-2xs text-muted-foreground">{vehicle.make} {vehicle.model} — {customer ? `${customer.first_name} ${customer.last_name}` : '—'}</p>
                  </button>
                ) : null;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
