import { BellIcon, CheckCircle2Icon, Loader2Icon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface NotificationDetailsDialogProps {
  notification: Notification | null;
  onOpenChange: (open: boolean) => void;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
  markingRead: boolean;
}

export function NotificationDetailsDialog({
  notification,
  onOpenChange,
  onMarkRead,
  onDelete,
  markingRead,
}: NotificationDetailsDialogProps) {
  return (
    <Dialog open={!!notification} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {notification && (
          <>
            <DialogHeader className="gap-3">
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl border",
                  notification.isRead
                    ? "border-border bg-muted text-muted-foreground"
                    : "border-tasuke-cyan/25 bg-tasuke-cyan/10 text-tasuke-cyan"
                )}
              >
                <BellIcon className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-base">{notification.title}</DialogTitle>
                  {!notification.isRead && (
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-tasuke-cyan/25 bg-tasuke-cyan/10 text-tasuke-cyan"
                    >
                      <span className="size-1.5 rounded-full bg-tasuke-cyan" />
                      Não lida
                    </Badge>
                  )}
                </div>
                <DialogDescription className="mt-1">
                  Recebida em {formatDateTime(notification.createdAt)}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="rounded-lg border border-border bg-muted/30 px-3.5 py-3 text-sm leading-relaxed text-foreground/90">
              {notification.message}
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium text-foreground">
                  {notification.isRead ? "Lida" : "Não lida"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Remetente</dt>
                <dd className="font-medium text-foreground">{notification.userName}</dd>
              </div>
            </dl>

            <DialogFooter>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(notification.id)}
              >
                <Trash2Icon />
                Excluir
              </Button>
              {!notification.isRead && (
                <Button onClick={() => onMarkRead(notification.id)} disabled={markingRead}>
                  {markingRead ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                      Marcando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2Icon />
                      Marcar como lida
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
