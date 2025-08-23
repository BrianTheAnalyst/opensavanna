
import { Search } from 'lucide-react';

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchInput = ({ value, onChange, onSubmit }: SearchInputProps) => {
  return (
    <form onSubmit={onSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search datasets by keyword..."
        className="w-full pl-10 pr-4 py-2 rounded-full bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
      />
    </form>
  );
};

export default SearchInput;
