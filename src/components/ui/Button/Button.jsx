import Spinner from '../Spinner/Spinner';
import RenderIcon from '../../../utils/iconMap';

const VARIANTS = {
  primary: 'border-primary bg-primary text-white hover:border-primary-hover hover:bg-primary-hover',
  secondary: 'border-secondary bg-secondary text-white hover:border-secondary-hover hover:bg-secondary-hover',
  success: 'border-success bg-success text-white hover:border-success-hover hover:bg-success-hover',
  danger: 'border-danger bg-danger text-white hover:border-danger-hover hover:bg-danger-hover',
  warning: 'border-warning bg-warning text-dark hover:border-warning-hover hover:bg-warning-hover',
  info: 'border-info bg-info text-dark hover:border-info-hover hover:bg-info-hover',
  'outline-primary': 'border-primary text-primary hover:bg-primary hover:text-white',
  'outline-secondary': 'border-secondary text-secondary hover:bg-secondary hover:text-white',
  'outline-success': 'border-success text-success hover:bg-success hover:text-white',
  'outline-danger': 'border-danger text-danger hover:bg-danger hover:text-white',
  'outline-warning': 'border-warning text-warning hover:bg-warning hover:text-dark',
  ghost: 'border-transparent text-primary hover:bg-primary/10',
};

const SIZES = {
  sm: 'rounded px-2 py-1 text-sm',
  md: 'rounded-md px-3 py-1.5 text-base',
  lg: 'rounded-lg px-4 py-2 text-lg',
};

const Button = ({
  variant = 'primary',
  size = 'sm',
  icon,
  loading = false,
  type = 'button',
  children,
  className = '',
  ...props
}) => {
  const { disabled } = props;
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1 border text-center align-middle font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-65 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.sm} ${className}`.trim()}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" className="mr-1" /> : null}
      {icon ? <RenderIcon name={icon} className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} /> : null}
      {children}
    </button>
  );
};

export default Button;