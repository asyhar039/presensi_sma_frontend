import RenderIcon from '../../../utils/iconMap';

const EmptyState = ({ icon, title, message = 'Belum ada data', action, className = '' }) => {
  return (
    <div className={`text-muted ${className}`.trim()}>
      {icon ? <RenderIcon name={icon} className="mr-1 inline h-5 w-5" /> : null}
      {title ? <div className="font-semibold">{title}</div> : null}
      {message ? <div>{message}</div> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
};

export default EmptyState;