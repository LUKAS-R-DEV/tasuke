import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { priorityConfig, statusConfig } from "@/lib/ticket-meta";
import type { TicketPriority, TicketStatus } from "@/types/ticket";

export function TicketStatusBadge({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5", config.badge, className)}>
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  );
}

export function TicketPriorityBadge({
  priority,
  className,
}: {
  priority: TicketPriority;
  className?: string;
}) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn(config.badge, className)}>
      {config.label}
    </Badge>
  );
}
