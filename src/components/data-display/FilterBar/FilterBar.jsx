import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';
import { DatePicker } from '../../ui/DatePicker/DatePicker';
import { SearchInput } from '../../ui/SearchInput/SearchInput';

export function FilterBar({ filters = [], values = {}, onChange, onReset, resetLabel = 'Reset' }) {
  const handleValue = (key, value) => onChange?.(key, value);

  return (
    <div className="mb-4 flex flex-wrap items-end gap-2">
      {filters.map((filter) => {
        if (filter.type === 'select') {
          return (
            <Select
              key={filter.key}
              label={filter.label}
              name={filter.key}
              value={values[filter.key] ?? ''}
              onChange={(name, value) => handleValue(name, value === '' ? null : value)}
              options={filter.options || []}
              placeholder={filter.placeholder || `-- Pilih ${filter.label} --`}
            />
          );
        }

        if (filter.type === 'month' || filter.type === 'date') {
          return (
            <DatePicker
              key={filter.key}
              mode={filter.type}
              label={filter.label}
              name={filter.key}
              value={values[filter.key] ?? ''}
              onChange={(name, value) => handleValue(name, value === '' ? null : value)}
            />
          );
        }

        if (filter.type === 'search') {
          return (
            <SearchInput
              key={filter.key}
              placeholder={filter.placeholder || 'Cari...'}
              value={values[filter.key] ?? ''}
              onChange={(value) => handleValue(filter.key, value)}
              onSearch={(value) => handleValue(filter.key, value)}
            />
          );
        }

        return (
          <Input
            key={filter.key}
            label={filter.label}
            name={filter.key}
            value={values[filter.key] ?? ''}
            onChange={(name, value) => handleValue(name, value === '' ? null : value)}
            type={filter.type || 'text'}
            placeholder={filter.placeholder}
          />
        );
      })}

      {onReset ? (
        <Button variant="outline-secondary" icon="undo" onClick={onReset}>{resetLabel}</Button>
      ) : null}
    </div>
  );
}