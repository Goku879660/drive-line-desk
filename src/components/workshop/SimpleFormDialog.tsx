import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SimpleFormOption {
  label: string;
  value: string;
}

export interface SimpleFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'password';
  placeholder?: string;
  options?: SimpleFormOption[];
  step?: string;
}

interface SimpleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: SimpleFormField[];
  defaultValues: Record<string, string | number | boolean | undefined>;
  onSubmit: (values: Record<string, string | number | boolean | undefined>) => void;
  submitLabel?: string;
}

export function SimpleFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = 'Save',
}: SimpleFormDialogProps) {
  const [values, setValues] = useState<Record<string, string | number | boolean | undefined>>(defaultValues);

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues, open]);

  const setValue = (name: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-4 py-2 max-h-[65vh] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-xs font-medium text-foreground">{field.label}</label>

              {field.type === 'textarea' ? (
                <Textarea
                  value={String(values[field.name] ?? '')}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-[100px] text-sm"
                />
              ) : field.type === 'select' ? (
                <Select value={String(values[field.name] ?? '')} onValueChange={(value) => setValue(field.name, value)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={field.placeholder || 'Select...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options || []).map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-sm">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm">
                  <Checkbox
                    checked={Boolean(values[field.name])}
                    onCheckedChange={(checked) => setValue(field.name, Boolean(checked))}
                  />
                  <span>{field.placeholder || field.label}</span>
                </label>
              ) : (
                <Input
                  type={field.type}
                  value={String(values[field.name] ?? '')}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  step={field.step}
                  className="h-9 text-sm"
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(values);
              onOpenChange(false);
            }}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
