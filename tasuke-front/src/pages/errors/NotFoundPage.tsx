import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, LayoutDashboardIcon } from "lucide-react";
import { TasukeLogo } from "@/components/common/TasukeLogo";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="login-background relative flex min-h-dvh flex-col items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tasuke-cyan/40 to-transparent" />

      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <TasukeLogo className="size-14" />

        <div className="relative">
          <h1 className="text-glow-cyan bg-gradient-to-b from-tasuke-cyan to-tasuke-cyan/40 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
            404
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Página não encontrada
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A página que você procura não existe, foi movida ou o endereço está incorreto.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
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
    </div>
  );
}
