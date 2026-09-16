"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-4 text-slate-300 dark:text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 inline-block",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export { Label };
export default Label;
