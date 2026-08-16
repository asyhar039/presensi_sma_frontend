import { RenderIcon } from '../../../utils/iconMap';

const VARIANTS = {
  info: 'border-[#b6effb] bg-[#cff4fc] text-[#055160]',
  success: 'border-[#badbcc] bg-[#d1e7dd] text-[#0f5132]',
  warning: 'border-[#ffecb5] bg-[#fff3cd] text-[#664d03]',
  danger: 'border-[#f5c2c7] bg-[#f8d7da] text-[#842029]',
};

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  className = '',
  onDismiss,
  ...props
}) {
  if (!children && !title) return null;

  return (
    <div
      className={`relative rounded-md border p-4 ${VARIANTS[variant] || VARIANTS.info} ${onDismiss ? 'pr-12' : ''} ${className}`.trim()}
      role="alert"
      {...props}
    >
      {title ? (
        <div className="mb-1 flex items-center font-bold">
          {icon ? <RenderIcon name={icon} className="mr-2 h-5 w-5" /> : null}
          {title}
        </div>
      ) : null}
      {!title && icon ? <RenderIcon name={icon} className="mr-2 inline h-5 w-5" /> : null}
      {children}
      {onDismiss ? (
        <button
          type="button"
          className="absolute top-2 right-2 flex size-6 items-center justify-center rounded hover:opacity-75"
          aria-label="Tutup"
          onClick={onDismiss}
        >
          <RenderIcon name="xmark" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
