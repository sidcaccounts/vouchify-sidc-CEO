import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CostEntry, COST_HEAD_OPTIONS, REMARKS_OPTIONS, SHORT_FORM_CODES } from '@/types/vouching-bill';
import { formatCurrency, generateId } from '@/utils/calculations';
import { Plus, Trash2, Receipt } from 'lucide-react';

interface CostEntryTableProps {
  entries: CostEntry[];
  onEntriesChange: (entries: CostEntry[]) => void;
}

export const CostEntryTable = ({ entries, onEntriesChange }: CostEntryTableProps) => {
  const addEntry = () => {
    const newEntry: CostEntry = {
      id: generateId(),
      costHead: '',
      description: '',
      amount: 0,
      remarks: ''
    };
    onEntriesChange([...entries, newEntry]);
  };

  const updateEntry = (id: string, field: keyof CostEntry, value: string | number) => {
    onEntriesChange(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const removeEntry = (id: string) => {
    onEntriesChange(entries.filter(entry => entry.id !== id));
  };

  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Card className="p-4 bg-gradient-to-br from-card to-accent/5 border-accent/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-accent">Cost Entry Table</h3>
        </div>
        <div className="text-sm font-medium text-success">
          Total Cost: {formatCurrency(total)}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 mb-3 text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Sl No</div>
            <div className="col-span-2">Cost Head</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Remarks</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Entries */}
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div key={entry.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-2 items-start">
                <div className="col-span-1 md:col-span-1 text-sm font-mono md:text-center">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Select
                    value={COST_HEAD_OPTIONS.includes(entry.costHead) ? entry.costHead : 'CUSTOM'}
                    onValueChange={(value) => {
                      if (value === 'CUSTOM') {
                        updateEntry(entry.id, 'costHead', '');
                      } else {
                        updateEntry(entry.id, 'costHead', value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {COST_HEAD_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {(!COST_HEAD_OPTIONS.includes(entry.costHead)) && (
                    <Input
                      value={entry.costHead}
                      onChange={(e) => updateEntry(entry.id, 'costHead', e.target.value)}
                      placeholder="Enter custom category"
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="col-span-1 md:col-span-4">
                  <Input
                    value={entry.description}
                    onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                    placeholder="Enter description"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <Input
                    type="number"
                    value={entry.amount || ''}
                    onChange={(e) => updateEntry(entry.id, 'amount', Number(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <Select
                    value={REMARKS_OPTIONS.includes(entry.remarks) ? entry.remarks : 'CUSTOM'}
                    onValueChange={(value) => {
                      if (value === 'CUSTOM') {
                        updateEntry(entry.id, 'remarks', '');
                      } else {
                        updateEntry(entry.id, 'remarks', value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {REMARKS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {(!REMARKS_OPTIONS.includes(entry.remarks)) && (
                    <Input
                      value={entry.remarks}
                      onChange={(e) => updateEntry(entry.id, 'remarks', e.target.value)}
                      placeholder="Enter custom remark"
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="col-span-1 md:col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    className="px-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={addEntry}
        variant="outline"
        size="sm"
        className="w-full mt-4 border-accent/50 text-accent hover:bg-accent/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Cost Entry
      </Button>
    </Card>
  );
};