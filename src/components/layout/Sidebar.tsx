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
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-[transform,width] duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-sidebar-border/40",
        isSmall ? "w-[72px]" : "w-[260px]",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      {/* Brand */}
      <div className={cn(
        "flex items-center h-[68px] border-b border-sidebar-border shrink-0 transition-all",
        isSmall ? "px-3 justify-center" : "px-5 justify-between"
      )}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
            <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          {!isSmall && (
            <div className="leading-tight animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="font-display font-bold text-[17px] text-white tracking-tight">ConectaCRM</div>
            </div>
          )}
        </div>
        
        {!isSmall && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-sidebar-foreground/40 hover:text-white hover:bg-sidebar-accent transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
        {isSmall && !flyout && (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-sidebar-primary text-white shadow-glow grid place-items-center z-50 lg:flex hidden"
          >
            <PanelLeftOpen className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Search */}
      {!isSmall && (
        <div className="px-4 pt-4 shrink-0">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40 group-focus-within:text-sidebar-primary transition-colors" />
            <Input 
              placeholder="Buscar menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 bg-sidebar-accent/30 border-sidebar-border/50 text-xs focus-visible:ring-sidebar-primary/30 placeholder:text-sidebar-foreground/30"
            />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item: any, idx: number) => {
          if (item.type === "header") {
            if (isSmall) return <div key={`header-${idx}`} className="h-px bg-sidebar-border/30 my-4 mx-2" />;
            return (
              <div key={`header-${idx}`} className="px-3 pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/30">
                {item.title}
              </div>
            );
          }

          const Icon = (Icons as any)[item.icon] || HelpCircle;
          const active = location.pathname === item.url || (item.children?.some((child: any) => location.pathname === child.url));

          const NavItem = (
            <div key={item.url} className="space-y-1">
              {item.flyout ? (
                <button
                  onClick={() => setFlyout(flyout?.url === item.url ? null : item)}
                  className={cn(
                    "group w-full relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-left",
                    isSmall ? "justify-center" : "",
                    active || flyout?.url === item.url
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
                  {!isSmall && <span className="flex-1 truncate">{item.title}</span>}
                  {!isSmall && <ChevronRight className={cn("h-4 w-4 ml-auto transition-transform", flyout?.url === item.url ? "rotate-90" : "")} />}
                  {item.badge && !isSmall && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase ml-1 shrink-0">{item.badge}</span>
                  )}
                </button>
              ) : (
                <Link
                  to={item.url}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    isSmall ? "justify-center" : "",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
                  {!isSmall && <span className="flex-1 truncate">{item.title}</span>}
                  {!isSmall && active && !item.children && <ChevronRight className="h-4 w-4 ml-auto opacity-80" />}
                  {!isSmall && item.children && <ChevronDown className={cn("h-3.5 w-3.5 ml-auto transition-transform", active ? "rotate-180" : "")} />}
                </Link>
              )}
              
              {!isSmall && item.children && active && (
                <div className="ml-9 space-y-1 border-l border-sidebar-border/50 pl-2 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {item.children.map((child: any) => (
                    <Link
                      key={child.url}
                      to={child.url}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-[12.5px] transition-colors",
                        location.pathname === child.url 
                          ? "text-white font-medium bg-white/10" 
                          : "text-sidebar-foreground/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );

          if (isSmall) {
            return (
              <Tooltip key={item.url}>
                <TooltipTrigger asChild>
                  {NavItem}
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  {item.title}
                  {item.badge && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-white/20 uppercase">{item.badge}</span>}
                </TooltipContent>
              </Tooltip>
            );
          }

          return NavItem;
        })}
      </nav>

      {/* Info card & User */}
      <div className="px-3 pb-3 space-y-3 shrink-0">
        {!isSmall && (
          <div className="rounded-xl bg-gradient-sidebar-cta p-3.5 text-white shadow-elegant relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <Sparkles className="h-12 w-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> IA Conecta
              </div>
              <p className="mt-1.5 text-xs text-white/85 leading-snug">
                Otimize seu atendimento com nossa IA.
              </p>
              <button className="mt-3 w-full rounded-md bg-white/15 hover:bg-white/25 backdrop-blur-sm py-1.5 text-xs font-medium transition shadow-sm">
                Ativar agora
              </button>
            </div>
          </div>
        )}

        <div className={cn(
          "pt-2 border-t border-sidebar-border/40 flex flex-col gap-1",
          isSmall ? "items-center" : ""
        )}>
          {isSmall ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="h-10 w-10 flex items-center justify-center rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair da Conta</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors group cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-sidebar-primary/20 border border-sidebar-primary/30 grid place-items-center text-sidebar-primary font-bold text-sm shrink-0">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-white truncate">{user?.email?.split('@')[0] || "Usuário"}</div>
                <div className="text-[11px] text-sidebar-foreground/50 truncate">Plano Pro</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-sidebar-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
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