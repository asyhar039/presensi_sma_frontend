import Badge from '../../ui/Badge/Badge';
import { getStatusTone } from '../../../constants/status';

const StatusBadge = ({ status, children, ...props }) => {
  return (
    <Badge tone={getStatusTone(status)} {...props}>
      {children || status}
    </Badge>
  );
};

export default StatusBadge;