import React, { forwardRef } from 'react';
import { classNames } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, fullWidth = true, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={classNames('flex flex-col gap-1.5', fullWidth ? 'w-full' : '')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={classNames(
            'w-full rounded-xl border bg-slate-800 px-4 py-2.5 text-sm text-white transition-all duration-200 outline-none appearance-none cursor-pointer',
            'focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
            error
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-white/10 hover:border-white/20',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
