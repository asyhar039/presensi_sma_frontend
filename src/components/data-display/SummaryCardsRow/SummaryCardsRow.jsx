import { statCardsData } from '../../../mocks/dashboardMock';
import SummaryCard from './SummaryCard';

const SummaryCardsRow = ({ data = statCardsData }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <SummaryCard
          key={item.id}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          icon={item.icon}
          iconBg={item.iconBg || 'bg-indigo-50'}
          iconColor={item.iconColor || 'text-indigo-600'}
          valueColor={item.valueColor || 'text-slate-900'}
        />
      ))}
    </div>
  );
};

export default SummaryCardsRow;