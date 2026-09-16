import { FaSearch } from 'react-icons/fa';
import { classNames } from '../../lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
  return (
    <div className={classNames('relative', className)}>
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
      />
    </div>
  );
}
