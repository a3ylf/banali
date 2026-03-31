import { Search } from "lucide-react";

interface CommandSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function CommandSearch({ value, onChange, placeholder = "Buscar..." }: CommandSearchProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground border-0 outline-none ring-1 ring-transparent focus:ring-primary/30 transition-shadow"
      />
    </div>
  );
}
