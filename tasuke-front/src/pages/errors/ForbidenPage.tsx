import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, LayoutDashboardIcon, ShieldAlertIcon } from "lucide-react";
import { TasukeLogo } from "@/components/common/TasukeLogo";
import { Button } from "@/components/ui/button";

export default function ForbidenPage() {
  const navigate = useNavigate();

  return (
    <div className="login-background relative flex min-h-dvh flex-col items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tasuke-cyan/40 to-transparent" />

      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <TasukeLogo className="size-14" />

        <div className="flex size-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
          <ShieldAlertIcon className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Acesso negado</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Você não possui permissão para acessar este recurso. Se acredita que isso é um erro,
            contate o administrador da plataforma.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
            Voltar
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            <LayoutDashboardIcon />
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
