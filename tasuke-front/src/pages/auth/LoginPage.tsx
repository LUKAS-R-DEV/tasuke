import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EyeIcon, EyeOffIcon, Loader2Icon, TriangleAlertIcon } from "lucide-react";
import { TasukeLogo } from "@/components/common/TasukeLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/errors";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha para entrar.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from && from !== "/login" ? from : "/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível entrar. Verifique suas credenciais e tente novamente."));
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Marca */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <TasukeLogo className="size-12" />
        <div className="text-center leading-tight">
          <p className="text-lg font-semibold tracking-[0.25em] text-foreground">TASUKE</p>
          <p className="mt-1 text-[0.6rem] font-medium tracking-[0.32em] text-muted-foreground">
            SUPPORT SYSTEM
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-base font-semibold tracking-tight text-foreground">
            Acesse sua conta
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre para gerenciar seus chamados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="voce@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-tasuke-cyan hover:underline"
          >
            Esqueci minha senha
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/60">
        Acesso restrito a usuários autorizados.
      </p>
    </div>
  );
}
