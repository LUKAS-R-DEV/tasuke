import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  BellIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  TicketIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { TasukeBrand, TasukeLogo } from "@/components/common/TasukeLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/format";
import { getRoleMeta } from "@/lib/user-meta";
import type { UserRole } from "@/types/user";

const ALL_ROLES: UserRole[] = ["ROLE_ADMIN", "ROLE_AGENT", "ROLE_CUSTOMER"];

const NAV_ITEMS: { label: string; to: string; icon: LucideIcon; roles?: UserRole[] }[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboardIcon, roles: ALL_ROLES },
  { label: "Tickets", to: "/tickets", icon: TicketIcon, roles: ALL_ROLES },
  { label: "Notificações", to: "/notifications", icon: BellIcon, roles: ALL_ROLES },
  { label: "Usuários", to: "/users", icon: UsersIcon, roles: ["ROLE_ADMIN"] },
  { label: "Meu Perfil", to: "/profile", icon: UserIcon, roles: ALL_ROLES },
  { label: "Configurações", to: "/settings", icon: SettingsIcon, roles: ALL_ROLES },
];

interface SidebarContentProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function SidebarContent({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: SidebarContentProps) {
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (!!user?.role && item.roles.includes(user.role as UserRole))
  );

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      {/* Logo */}
      <div className={cn("flex h-11 items-center", collapsed ? "justify-center" : "px-1")}>
        {collapsed ? (
          <TasukeLogo className="size-8" />
        ) : (
          <TasukeBrand logoClassName="size-8" />
        )}
      </div>

      {/* Navegação */}
      <nav className="mt-2 flex flex-col gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-accent text-tasuke-cyan shadow-[inset_2px_0_0_0_var(--color-tasuke-cyan)]",
                  collapsed && "justify-center px-0"
                )
              }
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );

          if (!collapsed) return <div key={item.to}>{link}</div>;

          return (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <div>{link}</div>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Recolher/expandir */}
      {onToggleCollapse && (
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={onToggleCollapse}
          className={cn("text-muted-foreground", !collapsed && "justify-start gap-3 px-3")}
        >
          {collapsed ? (
            <ChevronsRightIcon className="size-[18px]" />
          ) : (
            <>
              <ChevronsLeftIcon className="size-[18px]" />
              <span>Recolher</span>
            </>
          )}
        </Button>
      )}

      {/* Usuário */}
      <div className="mt-2 border-t border-sidebar-border pt-3">
        {collapsed ? (
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground">
                  <LogOutIcon className="size-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {initials(user?.name ?? "?")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-foreground">{user?.name ?? "Usuário"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {getRoleMeta(user?.role).label}
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleLogout} className="text-muted-foreground">
                  <LogOutIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Sair</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
