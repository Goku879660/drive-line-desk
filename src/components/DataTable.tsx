import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, ChevronUp, ChevronDown, Download, Filter, Columns3, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(columns.map((column) => [column.key, true]))
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const columnSignature = columns.map((column) => column.key).join('|');

  useEffect(() => {
    setVisibleColumns((prev) => {
      const next = Object.fromEntries(columns.map((column) => [column.key, prev[column.key] ?? true]));
      return next;
    });
  }, [columnSignature, columns]);

  const filterableColumns = useMemo(() => {
    return columns
      .map((column) => {
        if (column.key.endsWith('_id')) return null;
        const values = Array.from(
          new Set(
            data
              .map((item) => item[column.key])
              .filter((value) => ['string', 'number', 'boolean'].includes(typeof value))
              .map((value) => String(value).trim())
              .filter(Boolean)
          )
        ).slice(0, 8);

        if (values.length < 2 || values.length > 8) return null;
        if (values.some((value) => value.length > 28)) return null;

        return {
          key: column.key,
          header: column.header,
          values,
        };
      })
      .filter(Boolean) as Array<{ key: string; header: string; values: string[] }>;
  }, [columns, data]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        searchFields.some((field) => String(item[field] || '').toLowerCase().includes(query)) ||
        columns.some((column) => String(item[column.key] || '').toLowerCase().includes(query));

      const matchesFilters = Object.entries(activeFilters).every(([key, values]) => {
        if (values.length === 0) return true;
        return values.includes(String(item[key] ?? ''));
      });

      return matchesSearch && matchesFilters;
    });
  }, [activeFilters, columns, data, search, searchFields]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal || '').localeCompare(String(bVal || ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortDir, sortKey]);

  const visibleCols = columns.filter((column) => visibleColumns[column.key] ?? true);
  const hasActiveFilters = Object.values(activeFilters).some((values) => values.length > 0);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleColumn = (key: string, checked: boolean) => {
    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;
    if (!checked && visibleCount === 1) return;
    setVisibleColumns((prev) => ({ ...prev, [key]: checked }));
  };

  const toggleFilter = (key: string, value: string, checked: boolean) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      const nextValues = checked ? [...current, value] : current.filter((item) => item !== value);
      return { ...prev, [key]: nextValues };
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch('');
  };

  const exportCsv = () => {
    const headers = visibleCols.map((column) => column.header);
    const rows = sorted.map((item) => visibleCols.map((column) => String(item[column.key] ?? '')));
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'workshopos-export.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex flex-wrap items-center gap-2 pb-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Filter className="h-3 w-3" /> Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs">Quick filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterableColumns.length === 0 ? (
              <DropdownMenuItem disabled className="text-xs">
                No automatic filters available
              </DropdownMenuItem>
            ) : (
              filterableColumns.map((column) => (
                <div key={column.key}>
                  <DropdownMenuLabel className="text-2xs uppercase tracking-wide text-muted-foreground">
                    {column.header}
                  </DropdownMenuLabel>
                  {column.values.map((value) => (
                    <DropdownMenuCheckboxItem
                      key={`${column.key}-${value}`}
                      checked={(activeFilters[column.key] || []).includes(value)}
                      onCheckedChange={(checked) => toggleFilter(column.key, value, Boolean(checked))}
                      className="text-xs"
                    >
                      {value}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                </div>
              ))
            )}
            <DropdownMenuItem onClick={clearFilters} className="text-xs gap-2">
              <RotateCcw className="h-3 w-3" /> Reset search & filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Columns3 className="h-3 w-3" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className="text-xs">Visible columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={visibleColumns[column.key] ?? true}
                onCheckedChange={(checked) => toggleColumn(column.key, Boolean(checked))}
                className="text-xs"
              >
                {column.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={exportCsv}>
          <Download className="h-3 w-3" /> Export
        </Button>

        <span className="text-xs text-muted-foreground ml-auto">{sorted.length} results</span>
        {hasActiveFilters && <span className="text-2xs text-primary font-medium">Filtered</span>}
      </div>

      <div className="border rounded-md overflow-hidden bg-card">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {visibleCols.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'text-left text-xs font-medium text-muted-foreground px-3 whitespace-nowrap select-none',
                      compact ? 'py-2' : 'py-2.5',
                      column.sortable !== false && 'cursor-pointer hover:text-foreground transition-fast',
                      column.className
                    )}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {column.header}
                      {sortKey === column.key &&
                        (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={Math.max(visibleCols.length, 1)} className="px-3 py-8 text-center text-muted-foreground text-sm">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sorted.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={cn('border-b last:border-b-0 transition-fast', onRowClick && 'cursor-pointer hover:bg-muted/50')}
                    onClick={() => onRowClick?.(item)}
                  >
                    {visibleCols.map((column) => (
                      <td key={column.key} className={cn('px-3 whitespace-nowrap', compact ? 'py-2' : 'py-2.5', column.className)}>
                        {column.render ? column.render(item) : String(item[column.key] ?? '—')}
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
