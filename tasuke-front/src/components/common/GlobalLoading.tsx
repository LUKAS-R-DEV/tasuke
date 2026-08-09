import { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

/**
 * Barra de progresso global exibida no topo enquanto há requisições
 * (fetch ou mutation) ativas — estilo ciano com brilho sutil.
 */
export function GlobalLoading() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const active = isFetching > 0 || isMutating > 0;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (active) {
      timer = setTimeout(() => setVisible(true), 200);
    } else {
      timer = setTimeout(() => setVisible(false), 250);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [active]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0 bg-tasuke-cyan/20 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "absolute top-0 h-full w-1/3 bg-tasuke-cyan shadow-[0_0_12px_rgba(0,229,255,0.7)] transition-opacity duration-300",
          visible ? "opacity-100 animate-[tasuke-progress_1.2s_ease-in-out_infinite]" : "opacity-0"
        )}
      />
    </div>
  );
}
