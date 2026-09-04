import RenderIcon from '../../../utils/iconMap';
import Card from '../../ui/Card/Card';

const SummaryCard = ({ title, value, subtitle, icon, iconBg = 'bg-indigo-50', iconColor = 'text-indigo-600', valueColor = 'text-slate-900' }) => {
  return (
    <Card className="border-none p-5 bg-white rounded-2xl shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-start justify-between">
        <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">{title}</div>
        <div className={`p-2.5 ${iconBg} rounded-xl ${iconColor}`}>
          <RenderIcon name={icon} className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-2xl font-extrabold ${valueColor}`}>{value}</span>
        <span className="text-sm font-medium text-slate-500">{subtitle}</span>
      </div>
    </Card>
  );
};

export default SummaryCard;
