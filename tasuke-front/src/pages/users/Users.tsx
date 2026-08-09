import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  BanIcon,
  CheckCircle2Icon,
  LayoutDashboardIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldAlertIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { TasukeLogo } from "@/components/common/TasukeLogo";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateUser, useSetUserActive, useUpdateUser, useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/useAuth";
import { getRoleMeta } from "@/lib/user-meta";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ManagedUser, UserRole } from "@/types/user";

const PAGE_SIZE = 8;

const ROLE_FILTERS: { value: UserRole | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos os perfis" },
  { value: "ROLE_ADMIN", label: "Administrador" },
  { value: "ROLE_AGENT", label: "Agente de Suporte" },
  { value: "ROLE_CUSTOMER", label: "Cliente" },
];

const STATUS_FILTERS: { value: "ALL" | "ativo" | "inativo"; label: string }[] = [
  { value: "ALL", label: "Todos os status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

function statusMeta(active: boolean) {
  return active
    ? { label: "Ativo", dot: "bg-emerald-400", badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" }
    : { label: "Inativo", dot: "bg-muted-foreground", badge: "border-border bg-muted text-muted-foreground" };
}

export default function Users() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = authUser?.role === "ROLE_ADMIN";

  const usersQuery = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const setUserActive = useSetUserActive();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<"ALL" | "ativo" | "inativo">("ALL");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [togglingUser, setTogglingUser] = useState<ManagedUser | null>(null);

  const filtered = useMemo(() => {
    const users = usersQuery.data ?? [];
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      if (role !== "ALL" && user.role !== role) return false;
      if (status !== "ALL" && user.active !== (status === "ativo")) return false;
      if (query) {
        const haystack = `${user.name} ${user.email}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [usersQuery.data, search, role, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasFilters = search.trim() !== "" || role !== "ALL" || status !== "ALL";

  function openCreate() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEdit(user: ManagedUser) {
    setEditingUser(user);
    setFormOpen(true);
  }

  async function handleSubmit(values: { name: string; email: string; password: string; role: UserRole }) {
    const request = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    };
    try {
      if (editingUser) {
        await updateUser.mutateAsync({ id: editingUser.id, request });
        toast.success("Usuário atualizado!");
      } else {
        await createUser.mutateAsync(request);
        toast.success("Usuário criado!");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível salvar o usuário."));
      throw error;
    }
  }

  async function handleToggleActive() {
    if (!togglingUser) return;
    const target = togglingUser;
    setTogglingUser(null);
    try {
      await setUserActive.mutateAsync({ id: target.id, active: !target.active });
      toast.success(target.active ? "Usuário desativado." : "Usuário ativado.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível atualizar o status do usuário."));
    }
  }

  function clearFilters() {
    setSearch("");
    setRole("ALL");
    setStatus("ALL");
    setPage(1);
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[75dvh] items-center justify-center">
        <div className="w-full max-w-md p-6">
          <div className="mb-8 flex flex-col items-center gap-3">
            <TasukeLogo className="size-11" />
            <div className="text-center leading-tight">
              <p className="text-base font-semibold tracking-[0.25em] text-foreground">TASUKE</p>
              <p className="mt-0.5 text-[0.6rem] font-medium tracking-[0.32em] text-muted-foreground">
                SUPPORT SYSTEM
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
              <ShieldAlertIcon className="size-7" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Acesso restrito</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Apenas administradores podem gerenciar usuários. Entre em contato com um administrador
              para solicitar acesso.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeftIcon />
                Voltar
              </Button>
              <Button asChild>
                <Link to="/dashboard">
                  <LayoutDashboardIcon />
                  Ir para o Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground/60">
            Acesso restrito a usuários autorizados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Gerencie os acessos e perfis da plataforma."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon />
            Novo usuário
          </Button>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8"
            aria-label="Buscar usuários"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto">
          <Select
            value={role}
            onValueChange={(value) => {
              setRole(value as UserRole | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_FILTERS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as "ALL" | "ativo" | "inativo");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-44">
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
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {!usersQuery.isLoading && !usersQuery.isError && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Usuários</h2>
            <span className="rounded-md border border-border bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "usuário" : "usuários"}
            </span>
          </div>
        )}

        {usersQuery.isLoading ? (
          <LoadingState label="Carregando usuários..." />
        ) : usersQuery.isError ? (
          <div className="p-6">
            <ErrorState onRetry={() => usersQuery.refetch()} />
          </div>
        ) : visible.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={hasFilters ? SearchIcon : UsersIcon}
              title={hasFilters ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
              description={
                hasFilters
                  ? "Tente ajustar os filtros ou o termo de busca."
                  : "Cadastre o primeiro usuário para começar."
              }
              action={
                hasFilters ? (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                ) : (
                  <Button size="sm" onClick={openCreate}>
                    <PlusIcon />
                    Criar usuário
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="whitespace-nowrap">Criado em</TableHead>
                  <TableHead className="w-12 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((user) => {
                  const roleMeta = getRoleMeta(user.role);
                  const status = statusMeta(user.active);
                  return (
                    <TableRow key={user.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-accent text-xs text-tasuke-cyan">
                              {initials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(roleMeta.badge)}>
                          {roleMeta.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("gap-1.5", status.badge)}>
                          <span className={cn("size-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                        {formatDate(user.createdAt)}
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
                              <PencilIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-44">
                            <DropdownMenuItem onClick={() => openEdit(user)}>
                              <PencilIcon />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTogglingUser(user)}>
                              {user.active ? (
                                <>
                                  <BanIcon />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <CheckCircle2Icon />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {!usersQuery.isLoading && !usersQuery.isError && visible.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          onPageChange={setPage}
        />
      )}

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!togglingUser}
        onOpenChange={(open) => !open && setTogglingUser(null)}
        variant={togglingUser?.active ? "destructive" : "default"}
        title={togglingUser?.active ? "Desativar usuário" : "Ativar usuário"}
        description={
          togglingUser
            ? togglingUser.active
              ? `Tem certeza que deseja desativar ${togglingUser.name}? O acesso à plataforma será suspenso.`
              : `Tem certeza que deseja ativar ${togglingUser.name}?`
            : ""
        }
        confirmLabel={togglingUser?.active ? "Desativar" : "Ativar"}
        loading={setUserActive.isPending}
        onConfirm={handleToggleActive}
      />
    </div>
  );
}
