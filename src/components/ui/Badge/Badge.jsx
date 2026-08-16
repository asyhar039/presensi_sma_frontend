const TONES = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  success: 'bg-success text-white',
  info: 'bg-info text-dark',
  warning: 'bg-warning text-dark',
  danger: 'bg-danger text-white',
  light: 'bg-light text-dark',
  dark: 'bg-dark text-white',
};

export function Badge({ tone = 'secondary', children, className = '', ...props }) {
  return (
    <span
      className={`inline-block rounded-md px-[0.65em] py-[0.35em] text-[0.75em] leading-none text-center whitespace-nowrap align-baseline ${TONES[tone] || TONES.secondary} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}