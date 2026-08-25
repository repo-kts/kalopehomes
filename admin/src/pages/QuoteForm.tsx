import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ApiError, apiFetch } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Item {
  title: string;
  quantity: number;
  unitPrice: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function QuoteForm({
  leadId,
  onClose,
  onCreated,
}: {
  leadId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [items, setItems] = useState<Item[]>([{ title: '', quantity: 1, unitPrice: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(18);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const subtotal = round2(items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0));
  const taxable = Math.max(0, subtotal - discount);
  const taxAmount = round2((taxable * taxPercent) / 100);
  const total = round2(taxable + taxAmount);

  const updateItem = (idx: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  async function handleSubmit() {
    const valid = items.filter((i) => i.title.trim());
    if (valid.length === 0) {
      toast.error('Add at least one line item with a title');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/quotes', {
        method: 'POST',
        body: { leadId, discount, taxPercent, notes, status: 'SENT', items: valid },
      });
      toast.success('Quote created');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create quote');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New quotation</DialogTitle>
          <DialogDescription>Build a quote for this lead. Totals are computed automatically.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-end gap-2">
                <div className="flex-1">
                  {idx === 0 && <Label className="text-xs">Item</Label>}
                  <Input
                    value={item.title}
                    placeholder="e.g. Modular Kitchen"
                    onChange={(e) => updateItem(idx, { title: e.target.value })}
                  />
                </div>
                <div className="w-20">
                  {idx === 0 && <Label className="text-xs">Qty</Label>}
                  <Input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="w-32">
                  {idx === 0 && <Label className="text-xs">Unit price</Label>}
                  <Input
                    type="number"
                    value={item.unitPrice}
                    min={0}
                    onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                  disabled={items.length === 1}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => setItems((prev) => [...prev, { title: '', quantity: 1, unitPrice: 0 }])}
            >
              <Plus className="size-4" /> Add item
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Discount (₹)</Label>
              <Input
                type="number"
                value={discount}
                min={0}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Tax (%)</Label>
              <Input
                type="number"
                value={taxPercent}
                min={0}
                max={100}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>−{formatCurrency(discount)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax ({taxPercent}%)</span><span>{formatCurrency(taxAmount)}</span></div>
            <div className="mt-1 flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Spinner />}
            Create quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
