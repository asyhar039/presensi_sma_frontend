export function Spinner({ size = 'md', className = '', srText }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-current border-r-transparent align-middle ${size === 'sm' ? 'size-4 border-[0.2em]' : 'size-8 border-[0.25em]'} ${className}`.trim()}
      role="status"
      aria-hidden={srText ? undefined : true}
    >
      {srText ? <span className="sr-only">{srText}</span> : null}
    </span>
  );
}