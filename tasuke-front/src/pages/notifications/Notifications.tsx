import { useMemo, useState } from "react";
import {
  BellIcon,
  CheckCheckIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { NotificationDetailsDialog } from "@/components/notifications/NotificationDetailsDialog";
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
  useDeleteNotification,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/use-notifications";
import { getApiErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

type StatusFilter = "todas" | "lidas" | "nao_lidas";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "nao_lidas", label: "Não lidas" },
  { value: "lidas", label: "Lidas" },
];

export default function Notifications() {
  const notificationsQuery = useNotifications();
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("todas");
  const [details, setDetails] = useState<Notification | null>(null);
  const [deleting, setDeleting] = useState<Notification | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const notifications = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorted = [...(notificationsQuery.data ?? [])].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    return sorted.filter((notification) => {
      if (filter === "lidas" && !notification.isRead) return false;
      if (filter === "nao_lidas" && notification.isRead) return false;
      if (query) {
        const haystack = `${notification.title} ${notification.message}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [notificationsQuery.data, search, filter]);

  const unreadCount = (notificationsQuery.data ?? []).filter((n) => !n.isRead).length;

  function handleMarkRead(id: number) {
    try {
      markRead.mutate(id);
      if (details?.id === id) {
        setDetails((current) => (current ? { ...current, isRead: true } : current));
      }
      toast.success("Notificação marcada como lida.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível marcar como lida."));
    }
  }

  async function handleMarkAllRead() {
    const unread = (notificationsQuery.data ?? []).filter((n) => !n.isRead);
    if (unread.length === 0) return;
    setMarkingAll(true);
    try {
      await Promise.all(unread.map((notification) => markRead.mutateAsync(notification.id)));
      toast.success("Todas as notificações foram marcadas como lidas.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível marcar as notificações."));
    } finally {
      setMarkingAll(false);
    }
  }

  function handleDelete(id: number) {
    setDeleting(null);
    try {
      deleteNotification.mutate(id);
      setDetails((current) => (current?.id === id ? null : current));
      toast.success("Notificação excluída.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível excluir a notificação."));
    }
  }

  const hasFilters = search.trim() !== "" || filter !== "todas";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Gerencie e consulte o histórico das suas notificações."
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" onClick={handleMarkAllRead} disabled={markingAll}>
              {markingAll ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <CheckCheckIcon />
              )}
              Marcar todas como lidas
            </Button>
          ) : undefined
        }
      />

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou mensagem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
            aria-label="Buscar notificações"
          />
        </div>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {!notificationsQuery.isLoading && !notificationsQuery.isError && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Notificações</h2>
            <span className="rounded-md border border-border bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground">
              {notifications.length} {notifications.length === 1 ? "notificação" : "notificações"}
            </span>
          </div>
        )}

        {notificationsQuery.isLoading ? (
          <LoadingState label="Carregando notificações..." />
        ) : notificationsQuery.isError ? (
          <div className="p-6">
            <ErrorState onRetry={() => notificationsQuery.refetch()} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={hasFilters ? SearchIcon : BellIcon}
              title={hasFilters ? "Nenhuma notificação encontrada" : "Nenhuma notificação"}
              description={
                hasFilters
                  ? "Tente ajustar os filtros ou o termo de busca."
                  : "Você será notificado aqui sobre novidades nos seus chamados."
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetails(notification)}
                className={cn(
                  "group flex cursor-pointer items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40",
                  !notification.isRead && "bg-tasuke-cyan/[0.04]"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                    notification.isRead
                      ? "border-border bg-muted text-muted-foreground"
                      : "border-tasuke-cyan/25 bg-tasuke-cyan/10 text-tasuke-cyan"
                  )}
                >
                  <BellIcon className="size-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <span className="size-1.5 shrink-0 rounded-full bg-tasuke-cyan" />
                    )}
                    <p
                      className={cn(
                        "truncate text-sm",
                        notification.isRead
                          ? "font-normal text-foreground/75"
                          : "font-semibold text-foreground"
                      )}
                    >
                      {notification.title}
                    </p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>

                <div className="hidden shrink-0 flex-col items-end gap-0.5 sm:flex">
                  <span className="text-xs text-muted-foreground/70">
                    {timeAgo(notification.createdAt)}
                  </span>
                  <span className="text-[0.65rem] text-muted-foreground/50">
                    {notification.userName}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-tasuke-cyan"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleMarkRead(notification.id);
                      }}
                      aria-label="Marcar como lida"
                    >
                      <CheckCircle2Icon />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleting(notification);
                    }}
                    aria-label="Excluir notificação"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NotificationDetailsDialog
        notification={details}
        onOpenChange={(open) => !open && setDetails(null)}
        onMarkRead={handleMarkRead}
        onDelete={() => setDeleting(details)}
        markingRead={markRead.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        variant="destructive"
        title="Excluir notificação"
        description={
          deleting
            ? `Tem certeza que deseja excluir "${deleting.title}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        loading={deleteNotification.isPending}
        onConfirm={() => deleting && handleDelete(deleting.id)}
      />
    </div>
  );
}
