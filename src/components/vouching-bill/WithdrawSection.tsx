import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WithdrawEntry } from '@/types/vouching-bill';
import { formatCurrency, generateId } from '@/utils/calculations';
import { Plus, Trash2, CreditCard, Building, Smartphone } from 'lucide-react';

interface WithdrawSectionProps {
  title: string;
  entries: WithdrawEntry[];
  onEntriesChange: (entries: WithdrawEntry[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const WithdrawSection = ({ 
  title, 
  entries, 
  onEntriesChange, 
  placeholder = "Enter name",
  icon 
}: WithdrawSectionProps) => {
  const addEntry = () => {
    const newEntry: WithdrawEntry = {
      id: generateId(),
      name: '',
      amount: 0
    };
    onEntriesChange([...entries, newEntry]);
  };

  const updateEntry = (id: string, field: keyof WithdrawEntry, value: string | number) => {
    onEntriesChange(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const removeEntry = (id: string) => {
    onEntriesChange(entries.filter(entry => entry.id !== id));
  };

  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

  const getIcon = () => {
    if (icon) return icon;
    if (title.includes('Bank')) return <Building className="w-5 h-5" />;
    if (title.includes('Credit')) return <CreditCard className="w-5 h-5" />;
    if (title.includes('Bkash')) return <Smartphone className="w-5 h-5" />;
    return null;
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-card to-muted/30 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-primary">{title}</h3>
        </div>
        <div className="text-sm font-medium text-success">
          Total: {formatCurrency(total)}
        </div>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-2">
            <Input
              value={entry.name}
              onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Input
              type="number"
              value={entry.amount || ''}
              onChange={(e) => updateEntry(entry.id, 'amount', Number(e.target.value) || 0)}
              placeholder="Amount"
              className="w-32"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeEntry(entry.id)}
              className="px-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={addEntry}
        variant="outline"
        size="sm"
        className="w-full mt-3 border-primary/50 text-primary hover:bg-primary/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Entry
      </Button>
    </Card>
  );
};