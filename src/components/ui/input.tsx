import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-sm text-black bg-white",
          "placeholder:text-[var(--color-muted)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
          error ? "border-red-500" : "border-[var(--color-border)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";