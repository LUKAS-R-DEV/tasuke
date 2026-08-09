import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  Loader2Icon,
  PaperclipIcon,
  PlayIcon,
  SendIcon,
  TicketIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TicketPriorityBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import {
  useCreateComment,
  useSetTicketClosed,
  useSetTicketInProgress,
  useTicket,
  useTicketComments,
} from "@/hooks/use-tickets";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDateTime, initials } from "@/lib/format";

export default function TicketDetails() {
  const { id } = useParams();
  const ticketId = Number(id);
  const { user: authUser } = useAuth();

  const ticketQuery = useTicket(ticketId);
  const commentsQuery = useTicketComments(ticketId);

  const setInProgress = useSetTicketInProgress();
  const setClosed = useSetTicketClosed();
  const createComment = useCreateComment();

  const [message, setMessage] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);

  const ticket = ticketQuery.data;
  const comments = commentsQuery.data ?? [];
  const isAgent =
    authUser?.role === "ROLE_ADMIN" || authUser?.role === "ROLE_AGENT";

  const notFound =
    ticketQuery.isError &&
    (ticketQuery.error as { response?: { status?: number } } | undefined)?.response
      ?.status === 404;

  if (ticketQuery.isLoading) {
    return <LoadingState label="Carregando ticket..." />;
  }

  if (notFound || !ticket) {
    return (
      <div className="mx-auto max-w-2xl pt-10">
        <EmptyState
          icon={TicketIcon}
          title="Ticket não encontrado"
          description="O ticket que você procura não existe ou foi removido."
          action={
            <Button asChild>
              <Link to="/tickets">Voltar para tickets</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (ticketQuery.isError) {
    return (
      <div className="mx-auto max-w-2xl pt-10">
        <ErrorState onRetry={() => ticketQuery.refetch()} />
      </div>
    );
  }

  const current = ticket;

  async function handleStart() {
    try {
      await setInProgress.mutateAsync(current.id);
      toast.success("Ticket colocado em andamento.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível atualizar o ticket."));
    }
  }

  async function handleClose() {
    setConfirmClose(false);
    try {
      await setClosed.mutateAsync(current.id);
      toast.success("Ticket fechado com sucesso.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível fechar o ticket."));
    }
  }

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() || !authUser) return;
    try {
      await createComment.mutateAsync({
        message: message.trim(),
        ticketId: current.id,
        userId: authUser.id,
      });
      setMessage("");
      toast.success("Mensagem enviada.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível enviar a mensagem."));
    }
  }

  const isClosed = ticket.status === "CLOSED";

  return (
    <div className="space-y-6">
      {/* Voltar */}
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
        <Link to="/tickets">
          <ArrowLeftIcon />
          Voltar para tickets
        </Link>
      </Button>

      {/* Cabeçalho do ticket */}
      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-tasuke-cyan/30 bg-tasuke-cyan/10 px-2 py-0.5 text-xs font-semibold text-tasuke-cyan tabular-nums">
                  #{ticket.id}
                </span>
                <TicketStatusBadge status={ticket.status} />
                <TicketPriorityBadge priority={ticket.priority} />
              </div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {ticket.title}
              </h1>
            </div>

            {isAgent && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {ticket.status === "OPEN" && (
                  <Button onClick={handleStart} disabled={setInProgress.isPending}>
                    {setInProgress.isPending ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <PlayIcon />
                    )}
                    Colocar em andamento
                  </Button>
                )}
                {ticket.status === "IN_PROGRESS" && (
                  <Button variant="outline" onClick={() => setConfirmClose(true)}>
                    <XIcon />
                    Fechar ticket
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetaItem icon={UserIcon} label="Cliente" value={ticket.userName} />
            <MetaItem
              icon={CalendarIcon}
              label="Criado em"
              value={formatDateTime(ticket.createdAt)}
            />
            <MetaItem
              icon={CalendarIcon}
              label="Atualizado em"
              value={formatDateTime(ticket.updatedAt)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Conversa */}
          <Card>
            <CardHeader>
              <CardTitle>Conversa</CardTitle>
              <p className="text-xs text-muted-foreground">
                {commentsQuery.isLoading
                  ? "Carregando..."
                  : `${comments.length} ${comments.length === 1 ? "mensagem" : "mensagens"}`}
              </p>
            </CardHeader>
            <CardContent>
              {commentsQuery.isLoading ? (
                <LoadingState label="Carregando mensagens..." />
              ) : comments.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nenhuma mensagem ainda. Inicie a conversa abaixo.
                </p>
              ) : (
                <div className="space-y-5">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="mt-0.5 size-8">
                        <AvatarFallback className="bg-accent text-xs text-tasuke-cyan">
                          {initials(comment.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-sm font-medium text-foreground">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-muted-foreground/60">
                            {formatDateTime(comment.createdAt)}
                          </span>
                        </div>
                        <div className="mt-1.5 rounded-lg rounded-tl-none border border-border bg-muted/40 px-3 py-2 text-sm text-foreground/90">
                          <p className="whitespace-pre-line leading-relaxed">{comment.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Painel lateral — responder */}
        <Card className="self-start">
          <CardHeader>
            <CardTitle>Responder</CardTitle>
            <p className="text-xs text-muted-foreground">
              Envie uma mensagem para o solicitante
            </p>
          </CardHeader>
          <CardContent>
            {isClosed ? (
              <div className="rounded-lg border border-border bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
                Este ticket está encerrado. Não é possível enviar mensagens.
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-3">
                <Textarea
                  rows={5}
                  placeholder="Escreva sua resposta..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-label="Mensagem"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Anexar arquivo"
                    className="text-muted-foreground"
                  >
                    <PaperclipIcon />
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createComment.isPending || !message.trim()}
                  >
                    {createComment.isPending ? (
                      <>
                        <Loader2Icon className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <SendIcon />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anexos ainda não são suportados nesta versão.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        variant="destructive"
        title="Fechar ticket"
        description="Tem certeza que deseja fechar este ticket? A conversa será encerrada."
        confirmLabel="Fechar"
        loading={setClosed.isPending}
        onConfirm={handleClose}
      />
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
