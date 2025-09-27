import { Card } from '@/components/ui/card';
import { SHORT_FORM_CODES } from '@/types/vouching-bill';
import { Info } from 'lucide-react';

export const ShortFormReference = () => {
  return (
    <Card className="p-4 mb-6 bg-gradient-to-br from-info/5 to-info/10 border-info/20">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-info" />
        <h3 className="font-semibold text-info">Short Form Reference</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {Object.entries(SHORT_FORM_CODES).map(([code, meaning]) => (
          <div key={code} className="flex gap-2">
            <span className="font-mono font-bold text-info">{code}:</span>
            <span className="text-foreground">{meaning}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};