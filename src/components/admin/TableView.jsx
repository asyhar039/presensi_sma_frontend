export function TableView({ title, icon, columns, rows, emptyMessage }) {
  return (
    <div className="card-custom">
      <h5 className="fw-bold mb-3"><i className={`fas fa-${icon} text-primary me-2`}></i> {title}</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? rows.map((row, index) => (
              <tr key={row?.id || index}>
                {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row?.[column.key]}</td>)}
              </tr>
            )) : <tr><td colSpan={columns.length} className="text-muted">{emptyMessage}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
