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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PRIORITY_OPTIONS } from "@/lib/ticket-meta";
import type { TicketPriority } from "@/types/ticket";

export interface CreateTicketValues {
  title: string;
  description: string;
  priority: TicketPriority;
}

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateTicketValues) => Promise<void>;
}

export function CreateTicketDialog({ open, onOpenChange, onSubmit }: CreateTicketDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTicketValues>({
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
    },
  });

  async function onValid(values: CreateTicketValues) {
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo ticket</DialogTitle>
          <DialogDescription>
            Descreva o problema para que o time de suporte possa atendê-lo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
          <Field>
            <FieldLabel>Título</FieldLabel>
            <Input
              placeholder="Resumo curto do problema"
              aria-invalid={!!errors.title}
              {...register("title", { required: "Informe um título." })}
            />
            <FieldError errors={errors.title ? [errors.title] : []} />
          </Field>

          <Field>
            <FieldLabel>Descrição</FieldLabel>
            <Textarea
              placeholder="Descreva o problema com o máximo de detalhes..."
              rows={4}
              aria-invalid={!!errors.description}
              {...register("description", { required: "Informe uma descrição." })}
            />
            <FieldError errors={errors.description ? [errors.description] : []} />
          </Field>

          <Field>
            <FieldLabel>Prioridade</FieldLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.filter((opt) => opt.value !== "ALL").map((opt) => (
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
