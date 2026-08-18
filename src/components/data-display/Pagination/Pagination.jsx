const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const itemClass =
    'rounded border border-[#dee2e6] bg-white px-3 py-1.5 text-sm text-primary transition-colors hover:bg-[#e9ecef] disabled:pointer-events-none disabled:opacity-65';
  const activeClass = 'border-primary bg-primary text-white hover:bg-primary';

  return (
    <nav aria-label="Navigasi halaman">
      <ul className="m-0 flex list-none flex-wrap justify-center gap-1 p-0 sm:justify-end">
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