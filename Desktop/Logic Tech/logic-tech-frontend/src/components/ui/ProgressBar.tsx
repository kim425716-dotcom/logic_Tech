
import { classNames } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const sizeClasses = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

const variantGradients = {
  default: 'from-violet-500 to-indigo-500',
  success: 'from-emerald-500 to-teal-500',
  warning: 'from-amber-500 to-orange-500',
  danger: 'from-red-500 to-rose-500',
};

function getAutoVariant(value: number): 'default' | 'success' | 'warning' | 'danger' {
  if (value >= 80) return 'success';
  if (value >= 50) return 'default';
  if (value >= 25) return 'warning';
  return 'danger';
}

export default function ProgressBar({
  value,
  size = 'md',
  variant,
  showLabel = false,
  label,
  animated = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const resolvedVariant = variant ?? getAutoVariant(clampedValue);

  return (
    <div className={classNames('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showLabel && (
            <span className="text-xs font-semibold text-slate-300">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={classNames('w-full bg-slate-700/50 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={classNames(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            variantGradients[resolvedVariant],
            animated && 'animate-pulse',
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
