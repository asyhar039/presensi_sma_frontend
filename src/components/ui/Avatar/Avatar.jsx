import { getInitials } from '../../../utils/format';

const Avatar = ({ name, size, className = '' }) => {
  return (
    <div
      className={`flex size-[38px] items-center justify-center rounded-full bg-brand font-bold text-white ${className}`.trim()}
      style={size ? { width: size, height: size } : undefined}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;