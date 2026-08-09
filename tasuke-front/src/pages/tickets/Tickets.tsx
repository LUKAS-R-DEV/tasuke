import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  EyeIcon,
  FilterXIcon,
  PlusIcon,
  SearchIcon,
  TicketIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Pagination } from "@/components/common/Pagination";
import { TicketPriorityBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import {
  CreateTicketDialog,
  type CreateTicketValues,
} from "@/components/tickets/CreateTicketDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTickets, useCreateTicket } from "@/hooks/use-tickets";
import { useAuth } from "@/hooks/useAuth";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/ticket-meta";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import type { Ticket, TicketPriority, TicketStatus } from "@/types/ticket";

const PAGE_SIZE = 8;

export default function Tickets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: authUser } = useAuth();

  const ticketsQuery = useTickets();
  const createTicket = useCreateTicket();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TicketStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<TicketPriority | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(() => searchParams.get("novo") === "1");

  const canCreate = authUser?.role === "ROLE_ADMIN" || authUser?.role === "ROLE_CUSTOMER";

  const filtered = useMemo(() => {
    const tickets = ticketsQuery.data ?? [];
    const query = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (status !== "ALL" && ticket.status !== status) return false;
      if (priority !== "ALL" && ticket.priority !== priority) return false;
      if (query) {
        const haystack = [ticket.title, ticket.userName, String(ticket.id)]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [ticketsQuery.data, search, status, priority]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasFilters = search.trim() !== "" || status !== "ALL" || priority !== "ALL";

  async function handleCreate(values: CreateTicketValues) {
    if (!authUser) {
      toast.error("Faça login para criar um ticket.");
      return;
    }
    try {
      await createTicket.mutateAsync({
        title: values.title,
        description: values.description,
        priority: values.priority,
        userId: authUser.id,
      });
      toast.success("Ticket criado com sucesso!");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível criar o ticket."));
      throw error;
    }
  }

  function clearFilters() {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tickets"
        description="Gerencie todos os chamados de suporte."
        actions={
          canCreate ? (
            <Button onClick={() => setCreateOpen(true)}>
              <PlusIcon />
              Novo ticket
            </Button>
          ) : undefined
        }
      />

      {/* Filtros */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, cliente ou ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8"
            aria-label="Buscar tickets"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as TicketStatus | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(value) => {
              setPriority(value as TicketPriority | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {!ticketsQuery.isLoading && !ticketsQuery.isError && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Tickets</h2>
            <span className="rounded-md border border-border bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "chamado" : "chamados"}
            </span>
          </div>
        )}

        {ticketsQuery.isLoading ? (
          <LoadingState label="Carregando tickets..." />
        ) : ticketsQuery.isError ? (
          <div className="p-6">
            <ErrorState onRetry={() => ticketsQuery.refetch()} />
          </div>
        ) : visible.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={hasFilters ? FilterXIcon : TicketIcon}
              title={hasFilters ? "Nenhum ticket encontrado" : "Nenhum ticket por aqui"}
              description={
                hasFilters
                  ? "Tente ajustar os filtros ou o termo de busca."
                  : "Crie o primeiro ticket para começar a receber atendimento."
              }
              action={
                hasFilters ? (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <FilterXIcon />
                    Limpar filtros
                  </Button>
                ) : canCreate ? (
                  <Button size="sm" onClick={() => setCreateOpen(true)}>
                    <PlusIcon />
                    Criar ticket
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="whitespace-nowrap">Data</TableHead>
                  <TableHead className="w-12 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((ticket: Ticket) => (
                  <TableRow key={ticket.id} className="group">
                    <TableCell className="font-medium text-tasuke-cyan tabular-nums">
                      <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                        #{ticket.id}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[320px]">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="line-clamp-1 font-medium text-foreground transition-colors group-hover:text-tasuke-cyan"
                      >
                        {ticket.title}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <UserIcon className="size-3.5 text-muted-foreground/60" />
                        {ticket.userName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <TicketPriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                      {formatDate(ticket.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Ações"
                            className="opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                          >
                            <EyeIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-36">
                          <DropdownMenuItem asChild>
                            <Link to={`/tickets/${ticket.id}`}>
                              <EyeIcon />
                              Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {!ticketsQuery.isLoading && !ticketsQuery.isError && visible.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          onPageChange={setPage}
        />
      )}

      <CreateTicketDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          setSearchParams(open ? { novo: "1" } : {}, { replace: true });
        }}
        onSubmit={handleCreate}
      />
    </div>
  );
}
