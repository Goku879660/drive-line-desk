import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  variant?: 'default' | 'warning' | 'danger' | 'success';
  className?: string;
}

const variantStyles = {
  default: 'border-border',
  warning: 'border-l-4 border-l-warning border-t-border border-r-border border-b-border',
  danger: 'border-l-4 border-l-destructive border-t-border border-r-border border-b-border',
  success: 'border-l-4 border-l-success border-t-border border-r-border border-b-border',
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, variant = 'default', className }: KPICardProps) {
  return (
    <div className={cn("bg-card border rounded-md p-4 transition-fast", variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{title}</p>
          <p className="text-2xl font-semibold text-card-foreground tabular-nums">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("text-xs font-medium", trend.value >= 0 ? "text-emerald-600" : "text-red-600")}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
