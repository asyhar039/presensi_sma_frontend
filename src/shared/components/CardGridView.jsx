export function CardGridView({
  items,
  getKey,
  renderTitle,
  renderSubtitle,
  renderMeta,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  emptyMessage,
}) {
  return (
    <div className="row g-3">
      {items.length > 0 ? items.map((item) => (
        <div className="col-md-4" key={getKey(item)}>
          <div className="p-3 rounded-3 border">
            <div className="fw-bold">{renderTitle(item)}</div>
            <div className="text-muted small">{renderSubtitle(item)}</div>
            <div className="text-muted small mt-2">{renderMeta(item)}</div>
            {(canEdit || canDelete) ? (
              <div className="btn-group btn-group-sm mt-3">
                {canEdit ? (
                  <button className="btn btn-outline-warning" onClick={() => onEdit(item)}>
                    <i className="fas fa-edit"></i>
                  </button>
                ) : null}
                {canDelete ? (
                  <button className="btn btn-outline-danger" onClick={() => onDelete(item)}>
                    <i className="fas fa-trash"></i>
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )) : <div className="text-muted">{emptyMessage}</div>}
    </div>
  );
}
