import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ROLE_OPTIONS } from "@/lib/user-meta";
import type { ManagedUser, UserRole } from "@/types/user";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: ManagedUser | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

export function UserFormDialog({ open, onOpenChange, user, onSubmit }: UserFormDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          password: "",
          role: user.role,
        }
      : {
          name: "",
          email: "",
          password: "",
          role: "ROLE_CUSTOMER",
        },
  });

  function handleDialogOpen(next: boolean) {
    if (next && user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    }
    onOpenChange(next);
  }

  async function onValid(values: UserFormValues) {
    setSubmitting(true);
    try {
      await onSubmit(values);
      reset();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar usuário" : "Novo usuário"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do usuário."
              : "Crie um novo acesso para a plataforma."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
          <Field>
            <FieldLabel>Nome</FieldLabel>
            <Input
              placeholder="Nome completo"
              aria-invalid={!!errors.name}
              {...register("name", { required: "Informe o nome." })}
            />
            <FieldError errors={errors.name ? [errors.name] : []} />
          </Field>

          <Field>
            <FieldLabel>E-mail</FieldLabel>
            <Input
              type="email"
              placeholder="usuario@empresa.com"
              aria-invalid={!!errors.email}
              {...register("email", {
                required: "Informe o e-mail.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Informe um e-mail válido.",
                },
              })}
            />
            <FieldError errors={errors.email ? [errors.email] : []} />
          </Field>

          <Field>
            <FieldLabel>Senha</FieldLabel>
            <Input
              type="password"
              placeholder={isEditing ? "Defina a nova senha do usuário" : "••••••••"}
              aria-invalid={!!errors.password}
              {...register("password", {
                required: "Informe uma senha.",
                minLength: {
                  value: 6,
                  message: "A senha deve ter ao menos 6 caracteres.",
                },
              })}
            />
            <FieldError errors={errors.password ? [errors.password] : []} />
          </Field>

          <Field>
            <FieldLabel>Perfil</FieldLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                "Salvar alterações"
              ) : (
                "Criar usuário"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
