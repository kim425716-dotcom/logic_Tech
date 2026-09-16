
import { getInitials } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

export default function Avatar({ src, name, size = 'md', ring = false, className = '' }: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const ringClass = ring ? 'ring-2 ring-violet-500/50 ring-offset-2 ring-offset-slate-900' : '';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${ringClass} ${className}`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-gradient-to-br from-violet-600 to-indigo-600 text-white ${ringClass} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
