import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, fullWidth, className, type, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const inputElement = (
      <input
        type={type}
        ref={ref}
        id={inputId}
        className={cn(
          "flex h-9 w-full rounded-lg border border-white/10 bg-slate-900/50 dark:bg-slate-900/50 px-3 py-2 text-sm text-white shadow-sm transition-all placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50",
          type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          type === "file" &&
            "p-0 pr-3 italic text-slate-400 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-white/10 file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-white",
          error && "border-red-500/50 focus-visible:ring-red-500/20",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          className,
        )}
        {...props}
      />
    );

    if (label || error || hint || leftIcon || rightIcon || fullWidth) {
      return (
        <div className={cn("flex flex-col gap-1.5", fullWidth !== false && "w-full")}>
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
              {label}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {leftIcon}
              </span>
            )}
            {inputElement}
            {rightIcon && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {rightIcon}
              </span>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;
