import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  TicketIcon,
  TimerIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketStatusBadge, TicketPriorityBadge } from "@/components/common/StatusBadge";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { useTickets } from "@/hooks/use-tickets";
import { useAuth } from "@/hooks/useAuth";
import { priorityConfig, statusConfig } from "@/lib/ticket-meta";
import { timeAgo } from "@/lib/format";
import type { LucideIcon } from "lucide-react";
import type { TicketPriority, TicketStatus } from "@/types/ticket";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
  hint: string;
}

function StatCard({ label, value, icon: Icon, accent, hint }: StatCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const ticketsQuery = useTickets();
  const tickets = ticketsQuery.data ?? [];

  const canCreate = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_CUSTOMER";

  if (ticketsQuery.isLoading) {
    return <LoadingState label="Carregando dashboard..." />;
  }

  if (ticketsQuery.isError) {
    return (
      <div className="mx-auto max-w-2xl pt-10">
        <ErrorState onRetry={() => ticketsQuery.refetch()} />
      </div>
    );
  }

  const counts: Record<TicketStatus, number> = {
    OPEN: 0,
    IN_PROGRESS: 0,
    CLOSED: 0,
  };
  const priorityCounts: Record<TicketPriority, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };
  for (const ticket of tickets) {
    counts[ticket.status] += 1;
    priorityCounts[ticket.priority] += 1;
  }

  const total = tickets.length;
  const recentTickets = [...tickets]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const statusOrder: TicketStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED"];
  const priorityOrder: TicketPriority[] = ["LOW", "MEDIUM", "HIGH"];

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {greeting()}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {canCreate && (
          <Button asChild>
            <Link to="/tickets?novo=1">
              <TicketIcon />
              Novo ticket
            </Link>
          </Button>
        )}
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Abertos"
          value={counts.OPEN}
          icon={TicketIcon}
          accent="bg-tasuke-cyan/10 text-tasuke-cyan"
          hint="Aguardando atendimento"
        />
        <StatCard
          label="Em andamento"
          value={counts.IN_PROGRESS}
          icon={TimerIcon}
          accent="bg-tasuke-purple/10 text-tasuke-purple"
          hint="Em atendimento"
        />
        <StatCard
          label="Fechados"
          value={counts.CLOSED}
          icon={CheckCircle2Icon}
          accent="bg-emerald-400/10 text-emerald-300"
          hint="Resolvidos"
        />
        <StatCard
          label="Total"
          value={total}
          icon={CircleDotIcon}
          accent="bg-muted text-muted-foreground"
          hint="Todos os chamados"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tickets recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tickets recentes</CardTitle>
            <CardDescription>Os últimos chamados abertos na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="group flex items-center gap-4 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-tasuke-cyan tabular-nums">
                        #{ticket.id}
                      </span>
                      <p className="truncate text-sm font-medium text-foreground group-hover:text-tasuke-cyan">
                        {ticket.title}
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {ticket.userName} · {timeAgo(ticket.createdAt)}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
          <div className="px-4 pb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tickets">
                Ver todos os tickets
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Por prioridade */}
        <Card>
          <CardHeader>
            <CardTitle>Por prioridade</CardTitle>
            <CardDescription>Volume de chamados por prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityOrder.map((priority) => {
                const count = priorityCounts[priority];
                const percent = total ? Math.round((count / total) * 100) : 0;
                const config = priorityConfig[priority];
                return (
                  <div key={priority}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{config.label}</span>
                      <span className="font-semibold text-foreground tabular-nums">{count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-muted-foreground/60" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por status</CardTitle>
          <CardDescription>Visão geral do volume atual de chamados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {statusOrder.map((status) => {
              const count = counts[status];
              const percent = total ? Math.round((count / total) * 100) : 0;
              const config = statusConfig[status];
              return (
                <div key={status} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className={`size-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground tabular-nums">{count}</span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${config.dot}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{percent}% do total</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
