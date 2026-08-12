import { useLocation } from "react-router-dom";
import { MenuIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/layout/UserMenu";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/format";

const BREADCRUMBS: Record<string, string> = {
  dashboard: "Dashboard",
  tickets: "Tickets",
  users: "Usuários",
  profile: "Meu Perfil",
  settings: "Configurações",
};

function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const current = BREADCRUMBS[segments[0]] ?? segments[0];

  if (segments.length > 1 && segments[0] === "tickets") {
    const id = segments[1];
    return (
      <nav className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">{BREADCRUMBS.tickets}</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="truncate font-medium text-foreground">Ticket #{id}</span>
      </nav>
    );
  }

  return <span className="text-sm font-medium text-foreground">{current}</span>;
}

function StatusPill() {
  return (
    <span className="hidden items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground xl:inline-flex">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
      </span>
      <span className="font-medium">Operacional</span>
    </span>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="relative sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* brilho sutil à direita */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-72 bg-[radial-gradient(160px_70px_at_100%_50%,rgba(0,229,255,0.05),transparent)]" />

      {/* linha de acento futurista na base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-tasuke-cyan/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px shadow-[0_0_12px_rgba(0,229,255,0.35)]" />

      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <MenuIcon />
      </Button>

      <Breadcrumb />

      <div className="relative ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="relative hidden md:block">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar tickets..."
            className="h-8 w-44 pl-8 pr-8 text-sm lg:w-60"
            aria-label="Buscar"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
            /
          </kbd>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" aria-label="Buscar">
          <SearchIcon />
        </Button>

        <StatusPill />

        <NotificationsMenu />

        <UserMenu>
          <Button variant="ghost" className="h-8 gap-2 px-1.5">
            <Avatar className="size-7">
              <AvatarFallback className="bg-accent text-tasuke-cyan text-xs">
                {initials(user?.name ?? "?")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </UserMenu>
      </div>
    </header>
  );
}
