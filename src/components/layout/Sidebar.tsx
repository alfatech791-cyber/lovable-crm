import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Filter, MessageCircle, MessageSquare,
  Instagram, Workflow, UsersRound, BarChart3, Settings, Sparkles,
  Headphones, ChevronRight,
} from "lucide-react";

const iconMap = {
  LayoutDashboard, Users, Filter, MessageCircle, MessageSquare,
  Instagram, Workflow, UsersRound, BarChart3, Settings,
};

import { sidebarItems } from "@/lib/mock";

export function AppSidebar() {
  const location = useLocation();
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
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all
                ${active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-glow"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
              <span>{item.title}</span>
              {active && <ChevronRight className="h-4 w-4 ml-auto opacity-80" />}
            </Link>
          );
        })}
      </nav>

      {/* Plan card */}
      <div className="px-3 pb-3 space-y-3">
        <div className="rounded-xl bg-sidebar-accent/60 border border-sidebar-border p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-sidebar-foreground/80">Plano Empresarial 🏆</span>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-[11px] text-sidebar-foreground/60">Uso atual</span>
            <span className="text-[11px] font-semibold text-white">78%</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-sidebar-border overflow-hidden">
            <div className="h-full rounded-full bg-gradient-primary" style={{ width: "78%" }} />
          </div>
          <div className="mt-2 text-[11px] text-sidebar-foreground/55">Renova em 15 dias</div>
        </div>

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

        <Link to="/configuracoes" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition">
          <Headphones className="h-[18px] w-[18px]" />
          <div className="leading-tight">
            <div className="text-[13px] font-medium">Central de Ajuda</div>
            <div className="text-[11px] text-sidebar-foreground/50">Tutoriais e suporte</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}