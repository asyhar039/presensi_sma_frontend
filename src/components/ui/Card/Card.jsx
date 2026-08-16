import { RenderIcon } from '../../../utils/iconMap';

export function Card({
  title,
  icon,
  actions,
  children,
  className = 'mb-6 rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm',
}) {  return (
    <div className={className}>
      {title ? (
        <div className={actions ? 'mb-4 flex items-center justify-between' : 'mb-4'}>
          <h5 className="mb-0 text-xl font-bold">
            {icon ? <RenderIcon name={icon} className="mr-2 inline text-primary" /> : null}
            {title}
          </h5>
          {actions ? <div>{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
