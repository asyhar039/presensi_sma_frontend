import { statCardsData } from '../../../mocks/dashboardMock';
import RenderIcon from '../../../utils/iconMap';

const TONE_CLASSES = {
  primary: { card: 'border-primary/20 bg-primary/5', icon: 'bg-primary text-white', value: 'text-primary' },
  success: { card: 'border-success/20 bg-success/5', icon: 'bg-success text-white', value: 'text-success' },
  warning: { card: 'border-warning/20 bg-warning/5', icon: 'bg-warning text-white', value: 'text-warning' },
  info: { card: 'border-info/20 bg-info/5', icon: 'bg-info text-white', value: 'text-info' },
  danger: { card: 'border-danger/20 bg-danger/5', icon: 'bg-danger text-white', value: 'text-danger' },
  secondary: { card: 'border-secondary/20 bg-secondary/5', icon: 'bg-secondary text-white', value: 'text-secondary' },
};

const StatCard = ({ title, value, trend, icon, tone = 'primary', className = '' }) => {
  const toneMap = TONE_CLASSES[tone] || TONE_CLASSES.primary;

  return (
    <div
      className={`rounded-2xl border border-card-border bg-card-bg p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5 ${className}`.trim()}
      role="region"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h5 className="mb-1 text-[13px] font-semibold text-muted">{title}</h5>
          <p className={`mb-0 text-2xl font-extrabold tracking-tight sm:text-3xl ${toneMap.value}`}>{value}</p>
        </div>
        {icon ? (
          <div className={`flex size-11 flex-shrink-0 items-center justify-center rounded-xl ${toneMap.icon}`} aria-hidden="true">
            <RenderIcon name={icon} className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {trend ? <p className="mt-2 mb-0 truncate text-xs text-muted">{trend}</p> : null}
    </div>
  );
};

const StatCardsRow = ({ data = statCardsData }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {data.map((item) => (
        <StatCard
          key={item.id}
          title={item.title}
          value={item.value}
          trend={item.trend}
          icon={item.icon}
          tone={item.tone}
        />
      ))}
    </div>
  );
};

export { StatCardsRow, StatCard };
export default StatCardsRow;