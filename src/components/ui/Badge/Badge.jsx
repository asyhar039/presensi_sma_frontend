import { getStatusBadgeClass } from '../../../utils/format';

export function Badge({ status, children }) {
  return <span className={`badge ${getStatusBadgeClass(status)}`}>{children || status}</span>;
}
