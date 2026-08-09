import { Outlet } from "react-router-dom";

/**
 * Tela de autenticação — obsidian plano, conteúdo centralizado.
 */
export default function AuthLayout() {
  return (
    <div className="login-background relative flex min-h-dvh items-center justify-center overflow-hidden p-4 sm:p-6">
      <Outlet />
    </div>
  );
}
