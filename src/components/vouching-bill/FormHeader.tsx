import { Card } from '@/components/ui/card';
import logo from '@/assets/logo.png';

interface FormHeaderProps {
  name: string;
  date: string;
  onNameChange: (name: string) => void;
  onDateChange: (date: string) => void;
}

export const FormHeader = ({ name, date, onNameChange, onDateChange }: FormHeaderProps) => {
  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-[var(--shadow-header)]">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <img src={logo} alt="Sohani's Interior Design & Construction" className="w-16 h-16" />
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">SOHANI'S INTERIOR DESIGN & CONSTRUCTION</h1>
          <p className="text-lg opacity-90">(SiD&C)</p>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold text-center">Vouching & Non-Vouching Bill</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>
    </Card>
  );
};