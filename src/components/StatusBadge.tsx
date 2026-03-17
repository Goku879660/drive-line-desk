import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-fast whitespace-nowrap",
  {
    variants: {
      variant: {
        draft: "bg-muted text-muted-foreground",
        open: "bg-blue-50 text-blue-700 border border-blue-200",
        progress: "bg-blue-50 text-blue-700 border border-blue-200",
        waiting: "bg-amber-50 text-amber-700 border border-amber-200",
        completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        invoiced: "bg-violet-50 text-violet-700 border border-violet-200",
        cancelled: "bg-red-50 text-red-600 border border-red-200",
        overdue: "bg-red-50 text-red-700 border border-red-200",
        paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        sent: "bg-blue-50 text-blue-700 border border-blue-200",
        approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        declined: "bg-red-50 text-red-600 border border-red-200",
        expired: "bg-muted text-muted-foreground",
        converted: "bg-violet-50 text-violet-700 border border-violet-200",
        planned: "bg-muted text-muted-foreground border border-border",
        confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
        arrived: "bg-amber-50 text-amber-700 border border-amber-200",
        no_show: "bg-red-50 text-red-600 border border-red-200",
        partial: "bg-amber-50 text-amber-700 border border-amber-200",
        connected: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        disconnected: "bg-muted text-muted-foreground border border-border",
        error: "bg-red-50 text-red-600 border border-red-200",
        pass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        advisory: "bg-amber-50 text-amber-700 border border-amber-200",
        fail: "bg-red-50 text-red-700 border border-red-200",
        urgent: "bg-red-100 text-red-800 border border-red-300 font-semibold",
        high: "bg-orange-50 text-orange-700 border border-orange-200",
        normal: "bg-muted text-muted-foreground border border-border",
        low: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  }
);

const statusLabels: Record<string, string> = {
  draft: 'Draft', open: 'Open', progress: 'In Progress', in_progress: 'In Progress',
  waiting: 'Waiting', waiting_external: 'Waiting External', completed: 'Completed',
  invoiced: 'Invoiced', cancelled: 'Cancelled', overdue: 'Overdue', paid: 'Paid',
  sent: 'Sent', approved: 'Approved', declined: 'Declined', expired: 'Expired',
  converted: 'Converted', planned: 'Planned', confirmed: 'Confirmed', arrived: 'Arrived',
  no_show: 'No Show', partial: 'Partial', connected: 'Connected', disconnected: 'Disconnected',
  error: 'Error', pass: 'Pass', advisory: 'Advisory', fail: 'Fail',
  awaiting_approval: 'Awaiting Approval', parts_ordered: 'Parts Ordered',
  diagnosis: 'Diagnosis', closed: 'Closed', urgent: 'Urgent', high: 'High',
  normal: 'Normal', low: 'Low', pending: 'Pending', failed: 'Failed',
  refunded: 'Refunded',
};

const variantMap: Record<string, string> = {
  in_progress: 'progress', awaiting_approval: 'waiting', parts_ordered: 'waiting',
  waiting_external: 'waiting', closed: 'completed', diagnosis: 'open',
  pending: 'waiting', failed: 'cancelled', refunded: 'cancelled',
};

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = (variantMap[status] || status) as any;
  const label = statusLabels[status] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {label}
    </span>
  );
}
