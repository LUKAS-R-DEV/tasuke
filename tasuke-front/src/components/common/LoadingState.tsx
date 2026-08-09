import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Loader2Icon className="size-6 animate-spin text-tasuke-cyan" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/50" />
      ))}
    </div>
  );
}
