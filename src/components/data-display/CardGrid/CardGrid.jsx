import { Button } from '../../ui/Button/Button';
import { EmptyState } from '../../feedback/EmptyState/EmptyState';

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
  emptyMessage = 'Belum ada data',
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.length > 0 ? items.map((item) => (
        <div key={getKey(item)} className="rounded-lg border border-[#dee2e6] p-4">
          <div className="font-bold">{renderTitle(item)}</div>
          <div className="mt-1 text-sm text-muted">{renderSubtitle(item)}</div>
          <div className="mt-2 text-sm text-muted">{renderMeta(item)}</div>
          {(canEdit || canDelete) ? (
            <div className="mt-4 inline-flex overflow-hidden rounded-md border border-[#dee2e6]">
              {canEdit ? (
                <Button variant="outline-warning" className="rounded-none border-0" onClick={() => onEdit(item)}>
                  <i className="fas fa-edit"></i>
                </Button>
              ) : null}
              {canDelete ? (
                <Button variant="outline-danger" className="rounded-none border-0" onClick={() => onDelete(item)}>
                  <i className="fas fa-trash"></i>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      )) : (
        <div className="col-span-full">
          <EmptyState message={emptyMessage} />
        </div>
      )}
    </div>
  );
}