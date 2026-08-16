import { useEffect, useRef, useState } from 'react';

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Cari...',
  debounceMs = 300,
  className = '',
}) {
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
      <span className="flex items-center rounded-s-md border border-e-0 border-[#dee2e6] bg-[#e9ecef] px-3 text-secondary">
        <i className="fas fa-search"></i>
      </span>
      <input
        type="search"
        className={`min-w-0 flex-1 border border-[#dee2e6] bg-white px-3 py-1.5 text-base text-dark placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-primary/25 ${inputValue ? 'rounded-none' : 'rounded-e-md'}`}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={placeholder}
      />
      {inputValue ? (
        <button
          type="button"
          className="rounded-e-md border border-s-0 border-[#dee2e6] bg-white px-3 text-secondary hover:bg-light"
          aria-label="Hapus pencarian"
          onClick={() => handleChange('')}
        >
          <i className="fas fa-times"></i>
        </button>
      ) : null}
    </div>
  );
}