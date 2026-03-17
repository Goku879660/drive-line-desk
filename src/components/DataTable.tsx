import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronUp, ChevronDown, Download, Filter, Columns3 } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  searchPlaceholder?: string;
  searchFields?: string[];
  emptyMessage?: string;
  className?: string;
  compact?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  searchPlaceholder = 'Search...',
  searchFields = [],
  emptyMessage = 'No data found.',
  className,
  compact = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = data.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchFields.some(f => String(item[f] || '').toLowerCase().includes(q)) ||
      columns.some(c => String(item[c.key] || '').toLowerCase().includes(q));
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortKey], bVal = b[sortKey];
        const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal || '').localeCompare(String(bVal || ''));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2 pb-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Filter className="h-3 w-3" /> Filters
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Columns3 className="h-3 w-3" /> Columns
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Download className="h-3 w-3" /> Export
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">{sorted.length} results</span>
      </div>
      <div className="border rounded-md overflow-hidden bg-card">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "text-left text-xs font-medium text-muted-foreground px-3 whitespace-nowrap select-none",
                      compact ? "py-2" : "py-2.5",
                      col.sortable !== false && "cursor-pointer hover:text-foreground transition-fast",
                      col.className
                    )}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {sortKey === col.key && (
                        sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-muted-foreground text-sm">{emptyMessage}</td>
                </tr>
              ) : (
                sorted.map((item, i) => (
                  <tr
                    key={item.id || i}
                    className={cn(
                      "border-b last:border-b-0 transition-fast",
                      onRowClick && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-3 whitespace-nowrap", compact ? "py-2" : "py-2.5", col.className)}>
                        {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
