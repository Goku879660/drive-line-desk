import { communications, getCustomer } from '@/data/demo';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function CommunicationsPage() {
  return (
    <div className="p-4">
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-foreground">Communications</h1>
        <p className="text-xs text-muted-foreground">{communications.length} messages</p>
      </div>
      <div className="border rounded-md bg-card divide-y">
        {communications.map(com => {
          const customer = getCustomer(com.customer_id);
          return (
            <div key={com.id} className="px-4 py-3 hover:bg-muted/50 transition-fast cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                {com.direction === 'inbound' ? <ArrowDownLeft className="h-3 w-3 text-primary" /> : <ArrowUpRight className="h-3 w-3 text-muted-foreground" />}
                <StatusBadge status={com.channel} />
                <span className="text-xs font-medium">{customer ? `${customer.first_name} ${customer.last_name}` : '—'}</span>
                <span className="text-2xs text-muted-foreground ml-auto">{new Date(com.timestamp).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {com.subject && <p className="text-xs font-medium mb-0.5">{com.subject}</p>}
              <p className="text-xs text-muted-foreground line-clamp-2">{com.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
