import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { VouchingBillTotals } from '@/types/vouching-bill';
import { formatCurrency, convertToWords } from '@/utils/calculations';
import { Calculator, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummarySectionProps {
  totals: VouchingBillTotals;
  dueFrom: string;
  payableTo: string;
  charity: string;
  cashInBkashNagad: number;
  onDueFromChange: (value: string) => void;
  onPayableToChange: (value: string) => void;
  onCharityChange: (value: string) => void;
  onCashInBkashNagadChange: (value: number) => void;
}

export const SummarySection = ({
  totals,
  dueFrom,
  payableTo,
  charity,
  cashInBkashNagad,
  onDueFromChange,
  onPayableToChange,
  onCharityChange,
  onCashInBkashNagadChange
}: SummarySectionProps) => {
  const grandTotal = totals.totalReceived;

  return (
    <div className="space-y-4">
      {/* Totals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-lg font-bold text-success">{formatCurrency(totals.totalReceived)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(totals.totalCost)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/20 rounded-lg">
              <Wallet className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cash in Hand</p>
              <p className="text-lg font-bold text-info">{formatCurrency(totals.cashInHand)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/20 rounded-lg">
              <Calculator className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cash in Bkash/Nagad</p>
              <Input
                type="number"
                value={cashInBkashNagad || ''}
                onChange={(e) => onCashInBkashNagadChange(Number(e.target.value) || 0)}
                className="mt-1 h-8 text-sm font-bold"
                placeholder="0.00"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Details */}
      <Card className="p-6 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
        <h3 className="font-semibold text-brand-primary mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Summary Details
        </h3>

        <div className="space-y-4">
          {/* Amount in Words */}
          <div>
            <label className="block text-sm font-medium mb-2">Amount in Words:</label>
            <div className="p-3 bg-muted/50 rounded-md text-sm font-medium">
              {convertToWords(grandTotal)}
            </div>
          </div>

          {/* Summary Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Due From:</label>
              <Input
                value={dueFrom}
                onChange={(e) => onDueFromChange(e.target.value)}
                placeholder="Enter due from"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payable To:</label>
              <Input
                value={payableTo}
                onChange={(e) => onPayableToChange(e.target.value)}
                placeholder="Enter payable to"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Charity:</label>
              <Input
                value={charity}
                onChange={(e) => onCharityChange(e.target.value)}
                placeholder="Enter charity amount"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};