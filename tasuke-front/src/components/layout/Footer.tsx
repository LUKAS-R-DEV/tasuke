import { TasukeLogo } from "@/components/common/TasukeLogo";

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-border/60 pb-4 pt-6">
      {/* linha de acento futurista no topo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tasuke-cyan/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px shadow-[0_0_10px_rgba(0,229,255,0.25)]" />

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <TasukeLogo className="size-6" />
          <div className="leading-tight">
            <p className="text-xs font-semibold tracking-[0.2em] text-foreground">TASUKE</p>
            <p className="text-[0.55rem] font-medium tracking-[0.25em] text-muted-foreground">
              SUPPORT SYSTEM
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tasuke · Suporte e helpdesk
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.6rem]">
            v1.0.0
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tasuke-cyan opacity-50" />
              <span className="relative inline-flex size-1.5 rounded-full bg-tasuke-cyan" />
            </span>
            online
          </span>
        </div>
      </div>
    </footer>
  );
}
