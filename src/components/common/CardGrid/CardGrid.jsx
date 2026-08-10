import { Button } from '../../ui/Button/Button';

export function CardGrid({
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
                  <Button variant="outline-warning" onClick={() => onEdit(item)}>
                    <i className="fas fa-edit"></i>
                  </Button>
                ) : null}
                {canDelete ? (
                  <Button variant="outline-danger" onClick={() => onDelete(item)}>
                    <i className="fas fa-trash"></i>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )) : <div className="text-muted">{emptyMessage}</div>}
    </div>
  );
}
