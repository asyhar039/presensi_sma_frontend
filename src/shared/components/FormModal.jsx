import { useEffect, useState } from 'react';

export function FormModal({
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
                <div className="mb-3" key={field.key}>
                  <label className="form-label">{field.label}{field.required ? ' *' : ''}</label>
                  {field.type === 'select' ? (
                    <select
                      className="form-select"
                      value={values[field.key] ?? ''}
                      required={field.required}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    >
                      <option value="">-- Pilih {field.label} --</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      className="form-control"
                      value={values[field.key] ?? ''}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
              <button type="submit" className="btn btn-primary">{submitLabel}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
