"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

type ProgressProps = React.ComponentProps<"div"> & {
  value?: number;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-3 w-full overflow-hidden rounded-full border border-zinc-700 bg-zinc-900", className)}
    {...props}
  >
    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
));
Progress.displayName = "Progress";

export { Progress };