import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  className,
  icon,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-slate-950 text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800",
        variant === "ghost" &&
          "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
