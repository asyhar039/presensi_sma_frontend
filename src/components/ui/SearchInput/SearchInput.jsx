import { useEffect, useRef, useState } from 'react';
import RenderIcon from '../../../utils/iconMap';

const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Cari...',
  debounceMs = 300,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value ?? '');
  const timerRef = useRef(null);

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (next) => {
    setInputValue(next);
    onChange?.(next);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch?.(next), debounceMs);
  };

  return (
    <div className={`flex w-full items-stretch ${className}`.trim()}>
      <span className="flex items-center rounded-s-lg border border-e-0 border-slate-200 bg-slate-50 px-3 text-slate-400">
        <RenderIcon name="search" className="h-4 w-4" />
      </span>
      <input
        type="search"
        className={`min-w-0 flex-1 border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${inputValue ? 'rounded-none' : 'rounded-e-lg'}`}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={placeholder}
      />
      {inputValue ? (
        <button
          type="button"
          className="rounded-e-lg border border-s-0 border-slate-200 bg-white px-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          aria-label="Hapus pencarian"
          onClick={() => handleChange('')}
        >
          <RenderIcon name="xmark" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
};

export default SearchInput;