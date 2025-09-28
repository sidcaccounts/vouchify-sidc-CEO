import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormHeader } from './vouching-bill/FormHeader';
import { ShortFormReference } from './vouching-bill/ShortFormReference';
import { WithdrawSection } from './vouching-bill/WithdrawSection';
import { CostEntryTable } from './vouching-bill/CostEntryTable';
import { SummarySection } from './vouching-bill/SummarySection';
import { VouchingBillData, VouchingBillTotals, BANK_SUGGESTIONS, CREDIT_CARD_SUGGESTIONS } from '@/types/vouching-bill';
import { calculateTotals, generateId } from '@/utils/calculations';
import { generatePDF } from '@/utils/pdf-generator';
import { FileDown, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VouchingBillForm = () => {
  const { toast } = useToast();
  
  const [data, setData] = useState<VouchingBillData>({
    name: 'Homayra Mostofa (CEO)',
    date: new Date().toISOString().split('T')[0],
    bankWithdrawals: [],
    creditCardWithdrawals: [],
    bkashNagadWithdrawals: [],
    costEntries: [],
    dueFrom: '',
    payableTo: '',
    charity: '',
    cashInBkashNagad: 0
  });

  const [totals, setTotals] = useState<VouchingBillTotals>({
    totalReceived: 0,
    totalCost: 0,
    cashInHand: 0,
    cashInBkashNagad: 0
  });

  // Recalculate totals whenever data changes
  useEffect(() => {
    const newTotals = calculateTotals(data);
    setTotals(newTotals);
  }, [data]);

  const handleGeneratePDF = () => {
    try {
      generatePDF(data, totals);
      toast({
        title: "PDF Generated Successfully",
        description: "Your vouching bill has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Error Generating PDF",
        description: "There was an error creating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setData({
      name: 'Homayra Mostofa (CEO)',
      date: new Date().toISOString().split('T')[0],
      bankWithdrawals: [],
      creditCardWithdrawals: [],
      bkashNagadWithdrawals: [],
      costEntries: [],
      dueFrom: '',
      payableTo: '',
      charity: '',
      cashInBkashNagad: 0
    });
    toast({
      title: "Form Reset",
      description: "All form data has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <FormHeader
          name={data.name}
          date={data.date}
          onNameChange={(name) => setData(prev => ({ ...prev, name }))}
          onDateChange={(date) => setData(prev => ({ ...prev, date }))}
        />

        <ShortFormReference />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WithdrawSection
            title="Bank Withdrawals"
            entries={data.bankWithdrawals}
            onEntriesChange={(entries) => setData(prev => ({ ...prev, bankWithdrawals: entries }))}
            placeholder="Bank name (e.g., DBBL, City Bank)"
            suggestions={BANK_SUGGESTIONS}
          />
          
          <WithdrawSection
            title="Credit Card Withdrawals"
            entries={data.creditCardWithdrawals}
            onEntriesChange={(entries) => setData(prev => ({ ...prev, creditCardWithdrawals: entries }))}
            placeholder="Card type (e.g., DBBL Visa, Standard Chartered)"
            suggestions={CREDIT_CARD_SUGGESTIONS}
          />
          
          <WithdrawSection
            title="Bkash/Nagad Withdrawals"
            entries={data.bkashNagadWithdrawals}
            onEntriesChange={(entries) => setData(prev => ({ ...prev, bkashNagadWithdrawals: entries }))}
            placeholder="Account (e.g., Bkash 017xxxxxxx)"
          />
        </div>

        <CostEntryTable
          entries={data.costEntries}
          onEntriesChange={(entries) => setData(prev => ({ ...prev, costEntries: entries }))}
        />

        <SummarySection
          totals={totals}
          dueFrom={data.dueFrom}
          payableTo={data.payableTo}
          charity={data.charity}
          cashInBkashNagad={data.cashInBkashNagad}
          onDueFromChange={(value) => setData(prev => ({ ...prev, dueFrom: value }))}
          onPayableToChange={(value) => setData(prev => ({ ...prev, payableTo: value }))}
          onCharityChange={(value) => setData(prev => ({ ...prev, charity: value }))}
          onCashInBkashNagadChange={(value) => setData(prev => ({ ...prev, cashInBkashNagad: value }))}
        />

        {/* Action Buttons */}
        <Card className="p-4 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-brand-primary/20">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGeneratePDF}
              size="lg"
              className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white shadow-[var(--shadow-button)] px-8"
            >
              <FileDown className="w-5 h-5 mr-2" />
              Generate & Download PDF
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="border-destructive/50 text-destructive hover:bg-destructive/10 px-8"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Form
            </Button>
          </div>
        </Card>

        {/* Mobile-friendly sticky buttons */}
        <div className="fixed bottom-4 right-4 sm:hidden">
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleGeneratePDF}
              size="sm"
              className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white shadow-lg rounded-full w-12 h-12 p-0"
            >
              <FileDown className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};