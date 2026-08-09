import { useState, type FormEvent } from "react";
import { CalendarIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { getRoleMeta } from "@/lib/user-meta";
import { formatDate, initials } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const roleMeta = getRoleMeta(user?.role);

  function handlePasswordChange(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};

    if (!currentPassword) next.current = "Informe a senha atual.";
    if (newPassword.length < 6) next.new = "A nova senha deve ter ao menos 6 caracteres.";
    if (newPassword !== confirmPassword) next.confirm = "As senhas não coincidem.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 800);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações pessoais e de segurança."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identidade */}
        <Card className="lg:col-span-1 self-start">
          <CardHeader>
            <CardTitle>Identidade</CardTitle>
            <CardDescription>Informações do seu acesso</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 pb-6 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-accent text-2xl text-tasuke-cyan">
                {initials(user?.name ?? "?")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-semibold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="outline" className={cn("mt-2", roleMeta.badge)}>
                {roleMeta.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Informações da conta */}
        <Card className="lg:col-span-2 self-start">
          <CardHeader>
            <CardTitle>Informações da conta</CardTitle>
            <CardDescription>Detalhes cadastrais do seu usuário</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              <InfoRow icon={UserIcon} label="Nome" value={user?.name ?? "-"} />
              <InfoRow icon={MailIcon} label="E-mail" value={user?.email ?? "-"} />
              <InfoRow
                icon={ShieldIcon}
                label="Perfil"
                value={roleMeta.label}
              />
              <InfoRow
                icon={CalendarIcon}
                label="Membro desde"
                value={user?.createdAt ? formatDate(user.createdAt) : "-"}
              />
            </dl>
          </CardContent>
        </Card>

        {/* Alteração de senha */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alterar senha</CardTitle>
            <CardDescription>Atualize sua senha de acesso periodicamente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="max-w-xl space-y-4">
              <Field>
                <FieldLabel>Senha atual</FieldLabel>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={!!errors.current}
                />
                <FieldError errors={errors.current ? [{ message: errors.current }] : []} />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Nova senha</FieldLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={!!errors.new}
                  />
                  <FieldError errors={errors.new ? [{ message: errors.new }] : []} />
                </Field>
                <Field>
                  <FieldLabel>Confirmar nova senha</FieldLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={!!errors.confirm}
                  />
                  <FieldError errors={errors.confirm ? [{ message: errors.confirm }] : []} />
                </Field>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Atualizar senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <dt className="w-32 shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
