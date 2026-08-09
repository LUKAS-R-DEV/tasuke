import { cn } from "@/lib/utils";

interface TasukeLogoProps {
  className?: string;
  variant?: "default" | "mono";
}

/**
 * Símbolo original do Tasuke — um "mon" geométrico inspirado em kamon japoneses.
 * Três arcos interligados ao redor de um nó central (conexão, suporte e
 * colaboração) dentro de um anel que representa unidade e resolução de problemas.
 */
export function TasukeLogo({ className, variant = "default" }: TasukeLogoProps) {
  const mono = variant === "mono";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* anel externo — unidade */}
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke={mono ? "currentColor" : "#E4E4E7"}
        strokeWidth="2"
      />

      {/* anel tracejado interno — tecnologia */}
      <circle
        cx="24"
        cy="24"
        r="13.5"
        stroke={mono ? "currentColor" : "#A1A1AA"}
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.45"
      />

      {/* três arcos interligados — suporte / colaboração */}
      <path
        d="M 38.91 16.01 A 8.5 8.5 0 0 1 38.91 31.99"
        stroke={mono ? "currentColor" : "#E4E4E7"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 23.46 40.90 A 8.5 8.5 0 0 1 9.63 32.92"
        stroke={mono ? "currentColor" : "#E4E4E7"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 9.63 15.08 A 8.5 8.5 0 0 1 23.46 7.10"
        stroke={mono ? "currentColor" : "#E4E4E7"}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* halo do nó central */}
      <circle
        cx="24"
        cy="24"
        r="5.6"
        stroke={mono ? "currentColor" : "#00E5FF"}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* nó central — o suporte */}
      <circle
        cx="24"
        cy="24"
        r="3.2"
        fill={mono ? "currentColor" : "#00E5FF"}
      />

      {/* nós de conexão — acentos roxos */}
      {!mono && (
        <g fill="#8B5CF6">
          <circle cx="45" cy="24" r="1.6" />
          <circle cx="13.5" cy="42.19" r="1.6" />
          <circle cx="13.5" cy="5.81" r="1.6" />
        </g>
      )}
    </svg>
  );
}

/** Marca completa com símbolo + nome, usada na sidebar e no login. */
export function TasukeBrand({
  className,
  logoClassName,
  subtitle = true,
}: {
  className?: string;
  logoClassName?: string;
  subtitle?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <TasukeLogo className={cn("size-9", logoClassName)} />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-[0.22em] text-foreground">
          TASUKE
        </span>
        {subtitle && (
          <span className="text-[0.6rem] font-medium tracking-[0.28em] text-muted-foreground">
            SUPPORT SYSTEM
          </span>
        )}
      </div>
    </div>
  );
}
