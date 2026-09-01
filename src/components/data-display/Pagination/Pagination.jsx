const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const itemClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50';
  const activeClass = 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700';

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Halaman {page} dari {totalPages}
      </div>
      <ul className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
        <li>
          <button type="button" className={itemClass} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Sebelumnya
          </button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              className={`${itemClass} ${p === page ? activeClass : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          </li>
        ))}
        <li>
          <button type="button" className={itemClass} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Berikutnya
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;