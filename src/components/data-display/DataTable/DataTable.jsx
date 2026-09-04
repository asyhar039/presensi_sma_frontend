import { usePagination } from '../../../hooks/usePagination';
import Pagination from '../Pagination/Pagination';
import Button from '../../ui/Button/Button';
import Card from '../../ui/Card/Card';
import EmptyState from '../../feedback/EmptyState/EmptyState';
import Loading from '../../feedback/Loading/Loading';
import RenderIcon from '../../../utils/iconMap';

const DataTable = ({
  title,
  icon,
  description,
  columns = [],
  rows = [],
  keyField = 'id',
  loading = false,
  emptyMessage = 'Belum ada data',
  headerActions,
  toolbar,
  rowActions = [],
  paginated = false,
  pageSize = 10,
}) => {
  const { page, totalPages, pageItems, setPage } = usePagination(rows, pageSize);
  const displayRows = paginated ? pageItems : rows;
  const hasActions = rowActions.length > 0;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  return (
    <Card title={title} icon={icon} actions={headerActions}>
      {description ? <div className="mb-4 text-muted">{description}</div> : null}
      {toolbar ? <div className="mb-4">{toolbar}</div> : null}
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm text-slate-700">
            <thead>
              <tr className="bg-slate-50">
                {columns.map((column) => (
                  <th key={column.key} className="border-b border-slate-200 px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {column.label}
                  </th>
                ))}
                {hasActions ? <th className="border-b border-slate-200 px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Aksi</th> : null}
              </tr>
            </thead>
            <tbody>
              {displayRows.length > 0 ? displayRows.map((row, index) => (
                <tr key={row?.[keyField] ?? index} className="transition-colors hover:bg-slate-50/50 border-b border-slate-100">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle">
                      {column.render ? column.render(row) : row?.[column.key]}
                    </td>
                  ))}
                  {hasActions ? (
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="inline-flex items-center gap-1">
                        {rowActions.map((action) => (
                          action.hidden?.(row) ? null : (
                            <Button
                              key={action.key}
                              variant={action.variant}
                              title={action.label}
                              size="sm"
                              className="rounded-lg px-2 py-1.5"
                              onClick={() => action.onClick(row)}
                            >
                              <RenderIcon name={action.icon} className="h-4 w-4" />
                            </Button>
                          )
                        ))}
                      </div>
                    </td>
                  ) : null}
                </tr>
              )) : (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-8">
                    <EmptyState message={emptyMessage} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {paginated ? (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </Card>
  );
};

export default DataTable;