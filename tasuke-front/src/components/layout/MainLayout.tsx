import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { SidebarContent } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("tasuke-sidebar-collapsed") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasuke-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-dvh w-full overflow-hidden bg-background">
        {/* Sidebar desktop */}
        <aside
          className={cn(
            "hidden shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 ease-out lg:block",
            collapsed ? "w-[68px]" : "w-60"
          )}
        >
          <SidebarContent
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
          />
        </aside>

        {/* Sidebar mobile */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" showCloseButton={false} className="w-64 border-r border-border bg-sidebar p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Conteúdo */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="scrollbar-thin flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
              <div className="flex-1">
                <Outlet />
              </div>
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
