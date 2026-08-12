import { BellIcon, CheckCircle2Icon, Loader2Icon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useDeleteNotification,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/use-notifications";
import { getApiErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

function NotificationRow({ notification }: { notification: Notification }) {
  const markRead = useMarkNotificationRead();
  const removeNotification = useDeleteNotification();

  function handleMarkRead() {
    if (notification.isRead) return;
    try {
      markRead.mutate(notification.id);
    } catch {
      /* erro tratado abaixo */
    }
  }

  function handleDelete(event: React.MouseEvent) {
    event.stopPropagation();
    try {
      removeNotification.mutate(notification.id);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível remover a notificação."));
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleMarkRead}
      className={cn(
        "group relative flex cursor-pointer gap-3 border-b border-border/70 px-3 py-3 transition-colors last:border-b-0 hover:bg-muted/40",
        !notification.isRead && "bg-tasuke-cyan/[0.04]"
      )}
    >
      {!notification.isRead && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-tasuke-cyan shadow-[0_0_6px_rgba(0,229,255,0.7)]" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              notification.isRead ? "font-normal text-foreground/75" : "font-semibold text-foreground"
            )}
          >
            {notification.title}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground/70">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 self-center opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-tasuke-cyan"
            onClick={(event) => {
              event.stopPropagation();
              handleMarkRead();
            }}
            aria-label="Marcar como lida"
          >
            <CheckCircle2Icon />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          aria-label="Excluir notificação"
        >
          <Trash2Icon />
        </Button>
      </div>
    </div>
  );
}

export function NotificationsMenu() {
  const notificationsQuery = useNotifications();
  const notifications = [...(notificationsQuery.data ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const unread = notifications.filter((notification) => !notification.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
          aria-label="Notificações"
        >
          <BellIcon />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-tasuke-cyan px-1 text-[0.6rem] font-semibold text-primary-foreground shadow-[0_0_8px_rgba(0,229,255,0.8)]">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-80 max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground">Notificações</p>
          {unread > 0 && <span className="text-xs text-muted-foreground">{unread} não lidas</span>}
        </div>

        {notificationsQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Carregando...
          </div>
        ) : notificationsQuery.isError ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Não foi possível carregar as notificações.
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma notificação por aqui.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))}
          </div>
        )}

        <div className="border-t border-border px-3 py-2">
          <Link
            to="/notifications"
            className="block text-center text-xs font-medium text-tasuke-cyan underline-offset-4 hover:underline"
          >
            Ver todas as notificações
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
