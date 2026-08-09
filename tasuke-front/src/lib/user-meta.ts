import type { UserRole } from "@/types/user";

export const roleConfig: Record<UserRole, { label: string; badge: string }> = {
  ROLE_ADMIN: {
    label: "Administrador",
    badge: "border-tasuke-purple/25 bg-tasuke-purple/10 text-tasuke-purple",
  },
  ROLE_AGENT: {
    label: "Agente de Suporte",
    badge: "border-tasuke-cyan/25 bg-tasuke-cyan/10 text-tasuke-cyan",
  },
  ROLE_CUSTOMER: {
    label: "Cliente",
    badge: "border-border bg-muted text-muted-foreground",
  },
};

export function getRoleMeta(role?: string | null): { label: string; badge: string } {
  if (role && role in roleConfig) {
    return roleConfig[role as UserRole];
  }
  return { label: "Usuário", badge: "border-border bg-muted text-muted-foreground" };
}

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "ROLE_ADMIN", label: "Administrador" },
  { value: "ROLE_AGENT", label: "Agente de Suporte" },
  { value: "ROLE_CUSTOMER", label: "Cliente" },
];
