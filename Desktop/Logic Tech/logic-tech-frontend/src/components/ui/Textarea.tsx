import React, { forwardRef } from 'react';
import { classNames } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={classNames('flex flex-col gap-1.5', fullWidth ? 'w-full' : '')}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={classNames(
            'w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all duration-200 outline-none resize-y min-h-[100px]',
            'focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
            error
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-white/10 hover:border-white/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
