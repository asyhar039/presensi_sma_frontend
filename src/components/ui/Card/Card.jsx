import RenderIcon from '../../../utils/iconMap';

const Card = ({
  title,
  icon,
  actions,
  children,
  className = 'mb-6 rounded-2xl border border-card-border bg-card-bg p-4 shadow-sm sm:p-6',
}) => {
  return (
    <div className={className}>
      {title ? (
        <div className={actions ? 'mb-4 flex flex-wrap items-center justify-between gap-2' : 'mb-4'}>
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
};

export default Card;
