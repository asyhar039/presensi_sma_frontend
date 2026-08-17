import RenderIcon from '../../../utils/iconMap';

const LAYOUTS = {
  default: {
    wrapper: 'rounded-lg border border-[#dee2e6] bg-white p-4',
    value: 'text-2xl font-bold',
    label: '',
    iconBox: null,
  },
  icon: {
    wrapper: 'flex items-center gap-4 rounded-2xl border border-card-border bg-card-bg p-5 shadow-sm transition-transform hover:-translate-y-[3px]',
    value: 'text-2xl font-extrabold',
    label: 'text-[13px] font-semibold text-muted',
    iconBox: 'flex size-[52px] items-center justify-center rounded-2xl text-white',
  },
  flat: {
    wrapper: 'rounded-lg p-4',
    value: 'text-3xl font-bold',
    label: 'text-sm font-semibold',
    iconBox: null,
  },
};

const StatisticCard = ({
  label,
  value = 0,
  icon,
  tone = 'primary',
  layout = 'default',
  className = '',
}) => {
  const c = LAYOUTS[layout] || LAYOUTS.default;
  const wrapperClass = layout === 'flat' ? `${c.wrapper} bg-${tone}/10 text-${tone}` : c.wrapper;
  const valueClass = layout === 'icon' ? `${c.value} text-${tone}` : c.value;

  return (
    <div className={`${wrapperClass} ${className}`.trim()}>
      {c.iconBox ? (
        <div className={`${c.iconBox} bg-${tone}`}>
          <RenderIcon name={icon || 'chart-line'} className="h-6 w-6" />
        </div>
      ) : null}
      <div>
        <div className={valueClass}>{value}</div>
        <div className={c.label}>{label}</div>
      </div>
    </div>
  );
};

export default StatisticCard;

export const StatisticCardList = ({
  stats = {},
  labels = [],
  tones = [],
  layout = 'default',
  rowClassName = 'mt-4 grid grid-cols-1 gap-4 md:grid-cols-4',
  colClassName = '',
}) => {
  return (
    <div className={rowClassName}>
      {labels.map((label, index) => {
        const card = (
          <StatisticCard
            label={label}
            value={stats[label] ?? 0}
            layout={layout}
            tone={tones[index] || 'primary'}
          />
        );
        return colClassName ? <div className={colClassName} key={label}>{card}</div> : card;
      })}
    </div>
  );
}