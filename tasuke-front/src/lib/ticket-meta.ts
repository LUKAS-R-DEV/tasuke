import type { TicketPriority, TicketStatus } from "@/types/ticket";

export const statusConfig: Record<
  TicketStatus,
  { label: string; dot: string; badge: string }
> = {
  OPEN: {
    label: "Aberto",
    dot: "bg-tasuke-cyan",
    badge: "border-tasuke-cyan/25 bg-tasuke-cyan/10 text-tasuke-cyan",
  },
  IN_PROGRESS: {
    label: "Em andamento",
    dot: "bg-tasuke-purple",
    badge: "border-tasuke-purple/25 bg-tasuke-purple/10 text-tasuke-purple",
  },
  CLOSED: {
    label: "Fechado",
    dot: "bg-emerald-400",
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  },
};

export const priorityConfig: Record<
  TicketPriority,
  { label: string; badge: string }
> = {
  LOW: {
    label: "Baixa",
    badge: "border-border bg-muted text-muted-foreground",
  },
  MEDIUM: {
    label: "Média",
    badge: "border-border bg-muted/60 text-foreground/80",
  },
  HIGH: {
    label: "Alta",
    badge: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  },
};

export const STATUS_OPTIONS: { value: TicketStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos os status" },
  { value: "OPEN", label: "Aberto" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "CLOSED", label: "Fechado" },
];

export const PRIORITY_OPTIONS: { value: TicketPriority | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas as prioridades" },
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
];
