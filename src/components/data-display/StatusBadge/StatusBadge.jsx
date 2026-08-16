import { Badge } from '../../ui/Badge/Badge';
import { getStatusTone } from '../../../constants/status';

export function StatusBadge({ status, children, ...props }) {
  return (
    <Badge tone={getStatusTone(status)} {...props}>
      {children || status}
    </Badge>
  );
}