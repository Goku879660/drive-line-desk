import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, Users, Car, ClipboardList, Wrench, ShieldCheck,
  Package, Truck, FileText, Receipt, CreditCard, MessageSquare, FolderOpen,
  BarChart3, UserCog, Settings, ChevronLeft, ChevronRight, Plus, Search, Bell, Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useWorkshopStore } from '@/context/WorkshopContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/vehicles', label: 'Vehicles', icon: Car },
  { to: '/appointments', label: 'Appointments', icon: ClipboardList },
  { to: '/work-orders', label: 'Work Orders', icon: Wrench },
  { to: '/inspections', label: 'Inspections', icon: ShieldCheck },
  { to: '/parts', label: 'Parts & Inventory', icon: Package },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/quotes', label: 'Quotes', icon: FileText },
  { to: '/invoices', label: 'Invoices', icon: Receipt },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/communications', label: 'Communications', icon: MessageSquare },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/team', label: 'Team', icon: UserCog },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useWorkshopStore();

  const quickCreateItems = [
    { label: 'New Customer', icon: Users, path: '/customers' },
    { label: 'New Vehicle', icon: Car, path: '/vehicles' },
    { label: 'New Appointment', icon: ClipboardList, path: '/appointments' },
    { label: 'New Work Order', icon: Wrench, path: '/work-orders' },
    { label: 'New Quote', icon: FileText, path: '/quotes' },
    { label: 'New Invoice', icon: Receipt, path: '/invoices' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-150 ease-out shrink-0',
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        <div className={cn('flex items-center h-12 border-b border-sidebar-border px-3', collapsed && 'justify-center')}>
          {!collapsed && (
            <span className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">
              Workshop<span className="text-sidebar-primary">OS</span>
            </span>
          )}
          {collapsed && <Wrench className="h-5 w-5 text-sidebar-primary" />}
        </div>

        {!collapsed && (
          <div className="px-2 pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="w-full h-7 text-xs gap-1.5 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
                  <Plus className="h-3 w-3" /> Quick Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {quickCreateItems.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={() => navigate(item.path)} className="text-xs gap-2 cursor-pointer">
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2 space-y-0.5 select-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-2.5 rounded px-2 text-xs font-medium transition-fast',
                  collapsed ? 'justify-center py-2' : 'py-1.5',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full h-7 rounded text-sidebar-foreground hover:bg-sidebar-accent/50 transition-fast"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="flex items-center h-12 border-b bg-card px-4 gap-3 shrink-0">
          <button className="flex items-center gap-2 h-8 px-3 rounded-md border bg-muted/50 text-muted-foreground text-xs hover:bg-muted transition-fast max-w-md flex-1">
            <Search className="h-3.5 w-3.5" />
            <span>Search customers, plates, orders...</span>
            <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border bg-card px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive text-destructive-foreground text-2xs flex items-center justify-center font-medium">
                    {notifications.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold">Notifications</p>
                  <p className="text-2xs text-muted-foreground">Operational items requiring attention</p>
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <DropdownMenuItem disabled className="text-xs">
                    No active alerts
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="items-start cursor-pointer"
                      onClick={() => navigate(notification.route)}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground">{notification.title}</p>
                        <p className="text-2xs text-muted-foreground whitespace-normal">{notification.description}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
              JV
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>
      </div>

      <NavLink
        to="/developer"
        className="fixed bottom-3 right-3 h-8 w-8 rounded-md bg-card border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-fast z-50"
        title="Developer Settings"
      >
        <Settings className="h-4 w-4" />
      </NavLink>
    </div>
  );
}
