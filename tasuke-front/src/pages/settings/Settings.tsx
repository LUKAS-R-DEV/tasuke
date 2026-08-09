import { useState } from "react";
import { BellIcon, GlobeIcon, MoonIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const [language, setLanguage] = useState("pt-BR");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");

  const [notifications, setNotifications] = useState({
    email: true,
    ticket: true,
    mentions: false,
    weekly: false,
  });

  function toggle(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    toast.success("Preferências salvas!");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Ajuste suas preferências e notificações."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Preferências gerais */}
        <Card className="self-start">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GlobeIcon className="size-4 text-tasuke-cyan" />
              <CardTitle>Preferências gerais</CardTitle>
            </div>
            <CardDescription>Idioma e localização da interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Idioma</p>
                <p className="text-xs text-muted-foreground">Idioma exibido na interface</p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (BR)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground">Fuso horário</p>
                <p className="text-xs text-muted-foreground">Usado nas datas e horários</p>
              </div>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                  <SelectItem value="Europe/Lisbon">Lisboa (GMT+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground">Tema</p>
                <p className="text-xs text-muted-foreground">A aplicação opera apenas em tema escuro</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MoonIcon className="size-4 text-tasuke-cyan" />
                <span className="text-sm">Obsidian</span>
              </div>
            </div>

            <Button onClick={handleSave}>Salvar preferências</Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="self-start">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BellIcon className="size-4 text-tasuke-purple" />
              <CardTitle>Notificações</CardTitle>
            </div>
            <CardDescription>Escolha o que deseja receber</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <NotificationRow
                label="Notificações por e-mail"
                description="Receba avisos importantes no seu e-mail"
                checked={notifications.email}
                onChange={() => toggle("email")}
              />
              <NotificationRow
                label="Novos tickets"
                description="Quando um novo ticket for criado"
                checked={notifications.ticket}
                onChange={() => toggle("ticket")}
              />
              <NotificationRow
                label="Menções"
                description="Quando alguém mencionar você"
                checked={notifications.mentions}
                onChange={() => toggle("mentions")}
              />
              <NotificationRow
                label="Resumo semanal"
                description="Um resumo das atividades da semana"
                checked={notifications.weekly}
                onChange={() => toggle("weekly")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-emerald-400" />
              <CardTitle>Segurança</CardTitle>
            </div>
            <CardDescription>
              A autorização real é validada pelo servidor. Configurações de acesso são gerenciadas pelo
              administrador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Sua sessão atual é segura. Para alterar a senha, utilize a página{" "}
              <span className="font-medium text-foreground">Meu Perfil</span>.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
