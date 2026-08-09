import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed border-border px-6 py-14 text-center",
        className
      )}
    >
      <div className="seigaiha-pattern pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted/60 text-tasuke-cyan/80">
          <Icon className="size-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
