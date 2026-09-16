import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 hover:bg-amber-400 font-bold",
        primary: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25",
        destructive: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25",
        danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25",
        outline: "border border-amber-500/50 hover:border-amber-400 hover:bg-amber-500/10 text-amber-400",
        secondary: "bg-slate-700 hover:bg-slate-600 text-white",
        ghost: "hover:bg-white/10 text-slate-300 hover:text-white",
        link: "text-amber-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs gap-1.5",
        md: "h-10 px-5 py-2.5 text-sm gap-2",
        lg: "h-12 rounded-xl px-8 text-base gap-2.5",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, leftIcon, rightIcon, fullWidth = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full flex",
          isLoading && "relative text-transparent transition-none cursor-wait"
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="absolute inset-0 flex items-center justify-center text-current">
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </span>
            <span className="opacity-0 inline-flex items-center gap-2">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0 mr-1.5">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0 ml-1.5">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
