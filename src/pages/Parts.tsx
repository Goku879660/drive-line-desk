import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { parts } from '@/data/demo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PartsPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Parts & Inventory</h1>
          <p className="text-xs text-muted-foreground">{parts.length} parts in catalog</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3 w-3" /> Add Part</Button>
      </div>
      <DataTable
        data={parts}
        columns={[
          { key: 'sku', header: 'SKU', render: (p) => <span className="text-xs font-mono">{p.sku}</span> },
          { key: 'description', header: 'Description', render: (p) => <span className="text-xs font-medium">{p.description}</span> },
          { key: 'brand', header: 'Brand', render: (p) => <span className="text-xs">{p.brand}</span> },
          { key: 'category', header: 'Category', render: (p) => <span className="text-xs">{p.category}</span> },
          { key: 'stock_quantity', header: 'Stock', render: (p) => (
            <span className={`text-xs font-mono font-medium tabular-nums ${p.stock_quantity <= p.min_stock_level ? (p.stock_quantity === 0 ? 'text-destructive' : 'text-warning') : 'text-foreground'}`}>
              {p.stock_quantity}
            </span>
          )},
          { key: 'purchase_price', header: 'Cost', render: (p) => <span className="text-xs font-mono tabular-nums">€{p.purchase_price.toFixed(2)}</span> },
          { key: 'sale_price', header: 'Price', render: (p) => <span className="text-xs font-mono tabular-nums">€{p.sale_price.toFixed(2)}</span> },
          { key: 'margin', header: 'Margin', render: (p) => {
            const margin = ((p.sale_price - p.purchase_price) / p.sale_price * 100);
            return <span className="text-xs font-mono tabular-nums">{margin.toFixed(0)}%</span>;
          }},
          { key: 'location', header: 'Loc', render: (p) => <span className="text-xs font-mono">{p.location || '—'}</span> },
        ]}
        searchFields={['sku', 'description', 'brand', 'category']}
        searchPlaceholder="Search parts..."
      />
    </div>
  );
}
