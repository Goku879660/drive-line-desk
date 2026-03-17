import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, Users, Car, ClipboardList, Wrench, ShieldCheck,
  Package, Truck, FileText, Receipt, CreditCard, MessageSquare, FolderOpen,
  BarChart3, UserCog, Settings, ChevronLeft, ChevronRight, Plus, Search, Bell, Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-150 ease-out shrink-0",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center h-12 border-b border-sidebar-border px-3", collapsed && "justify-center")}>
          {!collapsed && (
            <span className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">
              Workshop<span className="text-sidebar-primary">OS</span>
            </span>
          )}
          {collapsed && <Wrench className="h-5 w-5 text-sidebar-primary" />}
        </div>

        {/* Quick Create */}
        {!collapsed && (
          <div className="px-2 pt-2">
            <Button size="sm" className="w-full h-7 text-xs gap-1.5 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
              <Plus className="h-3 w-3" /> Quick Create
            </Button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded px-2 text-xs font-medium transition-fast",
                  collapsed ? "justify-center py-2" : "py-1.5",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full h-7 rounded text-sidebar-foreground hover:bg-sidebar-accent/50 transition-fast"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center h-12 border-b bg-card px-4 gap-3 shrink-0">
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-2 h-8 px-3 rounded-md border bg-muted/50 text-muted-foreground text-xs hover:bg-muted transition-fast max-w-md flex-1"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search customers, plates, orders...</span>
            <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border bg-card px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive text-destructive-foreground text-2xs flex items-center justify-center font-medium">3</span>
            </Button>
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
              JV
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>

      {/* Developer gear button */}
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
