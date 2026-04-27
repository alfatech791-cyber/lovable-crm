import { Link, useLocation } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Sparkles, ChevronRight } from "lucide-react";
import { useAuth, UserPermissions } from "@/contexts/AuthContext";

import { sidebarItems } from "@/lib/mock";

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const filteredItems = sidebarItems;

  return (
    <aside className="hidden lg:flex w-[244px] shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-[68px] border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="font-display font-bold text-[17px] text-white tracking-tight">ConectaCRM</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item: any, idx: number) => {
          if (item.type === "header") {
            return (
              <div key={`header-${idx}`} className="px-3 pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/30">
                {item.title}
              </div>
            );
          }

          const Icon = (Icons as any)[item.icon] || Icons.HelpCircle;
          const active = location.pathname === item.url || (item.children?.some((child: any) => location.pathname === child.url));
          
          return (
            <div key={item.url} className="space-y-1">
              <Link
                to={item.url}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all
                  ${active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                  }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
                <span>{item.title}</span>
                {active && !item.children && <ChevronRight className="h-4 w-4 ml-auto opacity-80" />}
                {item.children && <Icons.ChevronDown className={`h-3.5 w-3.5 ml-auto transition-transform ${active ? "rotate-180" : ""}`} />}
              </Link>
              
              {item.children && active && (
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

        <Link to="/configuracoes" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition group">
          <Icons.Headphones className="h-[18px] w-[18px]" />
          <div className="leading-tight">
            <div className="text-[13px] font-medium">Central de Ajuda</div>
            <div className="text-[11px] text-sidebar-foreground/50">Tutoriais e suporte</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}