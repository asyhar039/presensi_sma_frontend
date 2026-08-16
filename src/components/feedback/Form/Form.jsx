import { useEffect, useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import Select from '../../ui/Select/Select';
import DatePicker from '../../ui/DatePicker/DatePicker';

const renderField = (field, value, onChange) => {
  const common = {
    key: field.key,
    label: field.label,
    name: field.key,
    value,
    onChange,
    required: field.required,
    error: field.error,
    disabled: field.disabled,
  };

  if (field.type === 'select') {
    return (
      <Select
        {...common}
        options={field.options || []}
        placeholder={field.placeholder || `-- Pilih ${field.label} --`}
      />
    );
  }

  if (field.type === 'date' || field.type === 'month') {
    return <DatePicker {...common} mode={field.type} min={field.min} max={field.max} />;
  }

  return <Input {...common} type={field.type || 'text'} placeholder={field.placeholder || ''} />;
}

const Form = ({
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Simpan',
  cancelLabel = 'Batal',
}) => {
  const [values, setValues] = useState(initialValues);
  const initialKey = JSON.stringify(initialValues ?? {});

  useEffect(() => {
    setValues(initialValues ?? {});
  }, [initialKey]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {fields.map((field) => renderField(field, values[field.key] ?? '', handleChange))}
      <div className="mt-4 flex justify-end gap-2">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        ) : null}
        <Button type="submit" variant="primary" size="md">{submitLabel}</Button>
      </div>
    </form>
  );
};

export default Form;