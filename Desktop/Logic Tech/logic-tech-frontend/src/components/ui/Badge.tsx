
import { classNames, statusColor, statusLabel } from '../../lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'auto' | 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'text-slate-400 bg-slate-400/10',
  success: 'text-emerald-400 bg-emerald-400/10',
  warning: 'text-amber-400 bg-amber-400/10',
  danger: 'text-red-400 bg-red-400/10',
  info: 'text-blue-400 bg-blue-400/10',
  purple: 'text-violet-400 bg-violet-400/10',
};

export default function Badge({ label, variant = 'auto', size = 'sm', dot = false, className }: BadgeProps) {
  const resolvedClass = variant === 'auto' ? statusColor(label.toLowerCase()) : (variantClasses[variant] ?? variantClasses.default);
  const resolvedLabel = variant === 'auto' ? statusLabel(label.toLowerCase()) : label;

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        resolvedClass,
        className,
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {resolvedLabel}
    </span>
  );
}
