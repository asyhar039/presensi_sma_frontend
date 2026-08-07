export function TableView({
  title,
  icon,
  description,
  columns,
  rows,
  emptyMessage,
  canCreate = false,
  canEdit = false,
  canDelete = false,
  onCreate,
  onEdit,
  onDelete,
}) {
  const actionCount = (canEdit || canDelete) ? 1 : 0;

  return (
    <div className="card-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0"><i className={`fas fa-${icon} text-primary me-2`}></i> {title}</h5>
        {canCreate ? (
          <button className="btn btn-sm btn-primary" onClick={onCreate}>
            <i className="fas fa-plus me-1"></i> Tambah
          </button>
        ) : null}
      </div>
      {description ? <div className="mb-3 text-muted">{description}</div> : null}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.label}</th>)}
              {actionCount ? <th className="text-end">Aksi</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? rows.map((row, index) => (
              <tr key={row?.id || index}>
                {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row?.[column.key]}</td>)}
                {actionCount ? (
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      {canEdit ? (
                        <button className="btn btn-outline-warning" title="Edit" onClick={() => onEdit?.(row)}>
                          <i className="fas fa-edit"></i>
                        </button>
                      ) : null}
                      {canDelete ? (
                        <button className="btn btn-outline-danger" title="Hapus" onClick={() => onDelete?.(row)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + actionCount} className="text-muted">{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
