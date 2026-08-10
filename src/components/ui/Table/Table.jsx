import { usePagination } from '../../../hooks/usePagination';
import { Pagination } from '../../common/Pagination/Pagination';
import { Button } from '../Button/Button';

export function Table({
  title,
  icon,
  description,
  columns,
  rows = [],
  emptyMessage,
  canCreate = false,
  canEdit = false,
  canDelete = false,
  onCreate,
  onEdit,
  onDelete,
  paginated = false,
  pageSize = 10,
}) {
  const { page, totalPages, pageItems, setPage } = usePagination(rows, pageSize);
  const displayRows = paginated ? pageItems : rows;
  const actionCount = (canEdit || canDelete) ? 1 : 0;

  return (
    <div className="card-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0"><i className={`fas fa-${icon} text-primary me-2`}></i> {title}</h5>
        {canCreate ? (
          <Button icon="plus" onClick={onCreate}>Tambah</Button>
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
            {displayRows.length > 0 ? displayRows.map((row, index) => (
              <tr key={row?.id || index}>
                {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row?.[column.key]}</td>)}
                {actionCount ? (
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      {canEdit ? (
                        <Button variant="outline-warning" onClick={() => onEdit?.(row)}>
                          <i className="fas fa-edit"></i>
                        </Button>
                      ) : null}
                      {canDelete ? (
                        <Button variant="outline-danger" onClick={() => onDelete?.(row)}>
                          <i className="fas fa-trash"></i>
                        </Button>
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
      {paginated ? (
        <div className="mt-3">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </div>
  );
}
