import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Option {
  value: string | number;
  label: string;
}

interface DropdownFilterProps {
  label: string;
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
}

export const DropdownFilter = ({ label, options, value, onChange, placeholder = 'Select...' }: DropdownFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 bg-dark-800 border rounded-xl transition-all duration-200",
          isOpen ? "border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]" : "border-white/10 hover:border-white/20"
        )}
      >
        <span className={cn("block truncate", !selectedOption && "text-gray-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "transform rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden glass-panel">
          <div className="p-2 border-b border-white/5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              className="w-full bg-dark-900/50 border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-orange-500/50 text-white placeholder-gray-500"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <ul className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">No results found</li>
            ) : (
              filteredOptions.map((opt) => (
                <li key={opt.value}>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                      value === opt.value
                        ? "bg-orange-500/10 text-orange-500 font-medium"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    <span className="truncate">{opt.label}</span>
                    {value === opt.value && <Check className="w-4 h-4" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
