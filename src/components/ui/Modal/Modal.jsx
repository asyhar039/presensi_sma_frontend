import { useEffect, useState } from 'react';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Button } from '../Button/Button';

export function Modal({
  open,
  title,
  fields,
  initialValues = {},
  onSubmit,
  onClose,
  submitLabel = 'Simpan',
}) {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (open) setValues(initialValues);
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {fields.map((field) => (
                field.type === 'select' ? (
                  <Select
                    key={field.key}
                    label={field.label}
                    name={field.key}
                    value={values[field.key] ?? ''}
                    onChange={handleChange}
                    options={field.options || []}
                    placeholder={`-- Pilih ${field.label} --`}
                    required={field.required}
                  />
                ) : (
                  <Input
                    key={field.key}
                    label={field.label}
                    name={field.key}
                    value={values[field.key] ?? ''}
                    onChange={handleChange}
                    type={field.type || 'text'}
                    placeholder={field.placeholder || ''}
                    required={field.required}
                  />
                )
              ))}
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={onClose}>Batal</Button>
              <Button type="submit" variant="primary" size="sm">{submitLabel}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
