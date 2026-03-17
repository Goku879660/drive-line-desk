import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { DataTable } from '@/components/DataTable';
import { appointments, workOrders, invoices, vehicles, parts, communications, getCustomer, getVehicle, getTeamMember } from '@/data/demo';
import { Wrench, Calendar, Receipt, AlertTriangle, Car, CreditCard, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const todayAppts = appointments.filter(a => {
  const d = new Date(a.scheduled_start);
  const now = new Date();
  return d.toDateString() === now.toDateString();
});

const activeWOs = workOrders.filter(wo => !['closed', 'invoiced'].includes(wo.status));
const overdueInvoices = invoices.filter(i => i.status === 'overdue');
const lowStockParts = parts.filter(p => p.stock_quantity <= p.min_stock_level);
const vehiclesExpiring = vehicles.filter(v => {
  if (!v.apk_expiry) return false;
  const exp = new Date(v.apk_expiry);
  const inDays = (exp.getTime() - Date.now()) / 86400000;
  return inDays <= 30 && inDays > -90;
});

const revenueToday = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Workshop overview for today</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        <KPICard title="Today's Appts" value={todayAppts.length} icon={Calendar} subtitle={`${todayAppts.filter(a => a.status === 'confirmed').length} confirmed`} />
        <KPICard title="Active WOs" value={activeWOs.length} icon={Wrench} subtitle={`${activeWOs.filter(w => w.priority === 'urgent').length} urgent`} variant={activeWOs.filter(w => w.priority === 'urgent').length > 0 ? 'danger' : 'default'} />
        <KPICard title="Overdue Invoices" value={overdueInvoices.length} icon={Receipt} subtitle={`€${overdueInvoices.reduce((s, i) => s + i.balance_due, 0).toFixed(0)}`} variant={overdueInvoices.length > 0 ? 'danger' : 'default'} />
        <KPICard title="Low Stock" value={lowStockParts.length} icon={AlertTriangle} variant={lowStockParts.length > 0 ? 'warning' : 'default'} />
        <KPICard title="APK Expiring" value={vehiclesExpiring.length} icon={Car} subtitle="Within 30 days" variant={vehiclesExpiring.length > 0 ? 'warning' : 'default'} />
        <KPICard title="Revenue (Paid)" value={`€${revenueToday.toFixed(0)}`} icon={CreditCard} trend={{ value: 12, label: 'vs last week' }} variant="success" />
        <KPICard title="Customers" value="12" icon={Users} subtitle="2 new this week" />
        <KPICard title="Utilization" value="78%" icon={Clock} subtitle="2 technicians" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Appointments */}
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Today's Appointments</h2>
          <DataTable
            data={todayAppts}
            columns={[
              { key: 'scheduled_start', header: 'Time', render: (a) => <span className="text-xs font-mono tabular-nums">{new Date(a.scheduled_start).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span> },
              { key: 'customer_id', header: 'Customer', render: (a) => { const c = getCustomer(a.customer_id); return <span className="text-xs font-medium">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>; } },
              { key: 'vehicle_id', header: 'Vehicle', render: (a) => { const v = getVehicle(a.vehicle_id); return <span className="text-xs font-mono">{v?.license_plate || '—'}</span>; } },
              { key: 'appointment_type', header: 'Type', render: (a) => <span className="text-xs">{a.appointment_type}</span> },
              { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
            ]}
            onRowClick={(a) => navigate('/appointments')}
            searchFields={['appointment_type']}
            searchPlaceholder="Search appointments..."
          />
        </div>

        {/* Active Work Orders */}
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Active Work Orders</h2>
          <DataTable
            data={activeWOs}
            columns={[
              { key: 'work_order_number', header: 'WO #', render: (wo) => <span className="text-xs font-mono font-medium">{wo.work_order_number}</span> },
              { key: 'customer_id', header: 'Customer', render: (wo) => { const c = getCustomer(wo.customer_id); return <span className="text-xs">{c ? `${c.first_name} ${c.last_name}` : '—'}</span>; } },
              { key: 'vehicle_id', header: 'Vehicle', render: (wo) => { const v = getVehicle(wo.vehicle_id); return <span className="text-xs font-mono">{v?.license_plate || '—'}</span>; } },
              { key: 'priority', header: 'Priority', render: (wo) => <StatusBadge status={wo.priority} /> },
              { key: 'status', header: 'Status', render: (wo) => <StatusBadge status={wo.status} /> },
            ]}
            onRowClick={(wo) => navigate('/work-orders')}
            searchFields={['work_order_number']}
            searchPlaceholder="Search work orders..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Communications */}
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Recent Communications</h2>
          <div className="border rounded-md bg-card divide-y">
            {communications.slice(0, 5).map(com => {
              const customer = getCustomer(com.customer_id);
              return (
                <div key={com.id} className="px-3 py-2 hover:bg-muted/50 transition-fast cursor-pointer">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={com.channel} />
                    <span className="text-xs font-medium truncate">{customer ? `${customer.first_name} ${customer.last_name}` : '—'}</span>
                    <span className="text-2xs text-muted-foreground ml-auto">{new Date(com.timestamp).toLocaleDateString('nl-NL')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{com.subject}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">Low Stock Alerts</h2>
          <div className="border rounded-md bg-card divide-y">
            {lowStockParts.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">All stock levels OK</div>
            ) : (
              lowStockParts.map(p => (
                <div key={p.id} className="px-3 py-2 hover:bg-muted/50 transition-fast cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{p.description}</span>
                    <span className={`text-xs font-mono font-medium ${p.stock_quantity === 0 ? 'text-destructive' : 'text-warning'}`}>
                      {p.stock_quantity}/{p.min_stock_level}
                    </span>
                  </div>
                  <span className="text-2xs text-muted-foreground font-mono">{p.sku}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* APK Expiring Soon */}
        <div>
          <h2 className="text-sm font-semibold mb-2 text-foreground">APK Expiring Soon</h2>
          <div className="border rounded-md bg-card divide-y">
            {vehiclesExpiring.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">No APK expiring soon</div>
            ) : (
              vehiclesExpiring.map(v => {
                const c = getCustomer(v.customer_id);
                const daysLeft = Math.ceil((new Date(v.apk_expiry!).getTime() - Date.now()) / 86400000);
                return (
                  <div key={v.id} className="px-3 py-2 hover:bg-muted/50 transition-fast cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium">{v.license_plate}</span>
                      <span className={`text-xs font-medium ${daysLeft < 0 ? 'text-destructive' : daysLeft < 14 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    </div>
                    <p className="text-2xs text-muted-foreground">{v.make} {v.model} — {c ? `${c.first_name} ${c.last_name}` : '—'}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
