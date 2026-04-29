import { Link, useLocation } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Sparkles, ChevronRight, X, Search, PanelLeftClose, PanelLeftOpen, LogOut, HelpCircle, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { sidebarItems } from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

export function AppSidebar({ open, setOpen }: { open?: boolean; setOpen?: (val: boolean) => void }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [flyout, setFlyout] = useState<any | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fecha flyout ao trocar de rota
  useEffect(() => { setFlyout(null); }, [location.pathname]);

  // Efeito para sincronizar flyout com colapso
  useEffect(() => {
    if (flyout) setIsCollapsed(true);
  }, [flyout]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return sidebarItems;
    
    const query = searchQuery.toLowerCase();
    return sidebarItems.filter((item: any) => {
      if (item.type === "header") return false;
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesChildren = item.children?.some((child: any) => 
        child.title.toLowerCase().includes(query)
      );
      return matchesTitle || matchesChildren;
    });
  }, [searchQuery]);

  const isSmall = isCollapsed || !!flyout;

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen?.(false)}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-[transform,width] duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${flyout ? "w-[68px]" : "w-[244px]"}
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
      {/* Brand */}
      <div className={`flex items-center gap-2.5 h-[68px] border-b border-sidebar-border ${flyout ? "px-3 justify-center" : "px-5"}`}>
        <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        {!flyout && (
          <div className="leading-tight">
            <div className="font-display font-bold text-[17px] text-white tracking-tight">ConectaCRM</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item: any, idx: number) => {
          if (item.type === "header") {
            if (flyout) return null;
            return (
              <div key={`header-${idx}`} className="px-3 pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/30">
                {item.title}
              </div>
            );
          }

          const Icon = (Icons as any)[item.icon] || Icons.HelpCircle;
          const active = location.pathname === item.url || (item.children?.some((child: any) => location.pathname === child.url));

          // Item com flyout: abre segundo painel ao clicar
          if (item.flyout) {
            const isOpen = flyout?.url === item.url;
            return (
              <button
                key={item.url}
                onClick={() => setFlyout(isOpen ? null : item)}
                title={flyout ? item.title : undefined}
                className={`group w-full relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-left ${flyout ? "justify-center" : ""}
                  ${active || isOpen
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                  }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active || isOpen ? 2.4 : 2} />
                {!flyout && <span>{item.title}</span>}
                {!flyout && <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${isOpen ? "translate-x-0.5" : ""}`} />}
              </button>
            );
          }

          return (
            <div key={item.url} className="space-y-1">
              <Link
                to={item.url}
                title={flyout ? item.title : undefined}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${flyout ? "justify-center" : ""}
                  ${active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                  }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
                {!flyout && <span>{item.title}</span>}
                {!flyout && active && !item.children && <ChevronRight className="h-4 w-4 ml-auto opacity-80" />}
                {!flyout && item.children && <Icons.ChevronDown className={`h-3.5 w-3.5 ml-auto transition-transform ${active ? "rotate-180" : ""}`} />}
              </Link>
              
              {!flyout && item.children && active && (
                <div className="ml-9 space-y-1 border-l border-sidebar-border/50 pl-2 py-1">
                  {item.children.map((child: any) => (
                    <Link
                      key={child.url}
                      to={child.url}
                      className={`block rounded-md px-3 py-1.5 text-[12.5px] transition-colors
                        ${location.pathname === child.url 
                          ? "text-white font-medium bg-white/10" 
                          : "text-sidebar-foreground/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Info card */}
      <div className="px-3 pb-3 space-y-3">
        {!flyout && (
          <div className="rounded-xl bg-gradient-sidebar-cta p-3.5 text-white shadow-elegant">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Novo: IA Conecta
            </div>
            <p className="mt-1.5 text-xs text-white/85 leading-snug">
              Resuma conversas, gere respostas e muito mais.
            </p>
            <button className="mt-3 w-full rounded-md bg-white/15 hover:bg-white/25 backdrop-blur-sm py-1.5 text-xs font-medium transition">
              Experimentar agora
            </button>
          </div>
        )}

        <button
          onClick={logout}
          title={flyout ? "Sair" : undefined}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition group ${flyout ? "justify-center" : ""}`}
        >
          <Icons.LogOut className="h-[18px] w-[18px]" />
          {!flyout && (
            <div className="leading-tight text-left">
              <div className="text-[13px] font-medium">Sair da Conta</div>
              <div className="text-[11px] opacity-60">Encerrar sessão</div>
            </div>
          )}
        </button>
      </div>
    </aside>

    {/* Flyout: segundo painel dedicado */}
    {flyout && (
      <aside className="relative z-40 w-[280px] shrink-0 bg-sidebar border-l border-sidebar-border/40 text-sidebar-foreground flex flex-col shadow-2xl animate-in slide-in-from-left-4 duration-200">
          <div className="flex items-center justify-between px-5 h-[68px] border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
                {(() => {
                  const FIcon = (Icons as any)[flyout.icon] || Icons.HelpCircle;
                  return <FIcon className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />;
                })()}
              </div>
              <div className="leading-tight">
                <div className="font-display font-bold text-[16px] text-white tracking-tight">{flyout.title}</div>
                <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 font-bold">Menu dedicado</div>
              </div>
            </div>
            <button
              onClick={() => setFlyout(null)}
              className="h-8 w-8 grid place-items-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white transition"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {flyout.children?.map((child: any) => {
              const ChildIcon = child.icon ? (Icons as any)[child.icon] : null;
              const isActive = location.pathname === child.url;
              return (
                <Link
                  key={child.url}
                  to={child.url}
                  onClick={() => setFlyout(null)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all
                    ${isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                    }`}
                >
                  {ChildIcon ? (
                    <ChildIcon className="h-[16px] w-[16px]" strokeWidth={isActive ? 2.4 : 2} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                  )}
                  <span className="flex-1">{child.title}</span>
                  {child.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase">{child.badge}</span>
                  )}
                  <ChevronRight className={`h-3.5 w-3.5 transition-opacity ${isActive ? "opacity-80" : "opacity-0 group-hover:opacity-60"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="px-3 pb-3">
            <Link
              to={flyout.url}
              onClick={() => setFlyout(null)}
              className="block rounded-xl bg-gradient-sidebar-cta p-3 text-white shadow-elegant hover:opacity-90 transition"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80 mb-1">
                <Sparkles className="h-3 w-3" /> Visão Geral
              </div>
              <div className="text-sm font-bold">Abrir painel completo</div>
            </Link>
          </div>
      </aside>
    )}
    </>
  );
}