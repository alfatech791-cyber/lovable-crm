import { createFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Sparkles, UserPlus, Trello, Bot, Zap, MessageSquare, Instagram, ArrowRight, TrendingUp, DollarSign, Users, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "CRM — ConectaCRM" },
      { name: "description", content: "Hub central do CRM: leads, funil, bot e automações." },
    ],
  }),
  component: CrmHub,
});

const modules = [
  { title: "Leads", desc: "Cadastro e qualificação de contatos", url: "/leads", icon: UserPlus, color: "text-primary", bg: "bg-primary/10" },
  { title: "Funil de Vendas", desc: "Pipeline Kanban por estágio", url: "/funil", icon: Trello, color: "text-info", bg: "bg-info/10" },
  { title: "Bot de Atendimento", desc: "IA que atende 24/7 no WhatsApp", url: "/crm/bot", icon: Bot, color: "text-success", bg: "bg-success/10" },
  { title: "Automações", desc: "Fluxos automáticos baseados em gatilhos", url: "/automacao", icon: Zap, color: "text-warning", bg: "bg-warning/10" },
  { title: "WhatsApp", desc: "Conexão de instâncias e conversas", url: "/whatsapp", icon: MessageSquare, color: "text-success", bg: "bg-success/10" },
  { title: "Instagram", desc: "Direct e comentários integrados", url: "/instagram", icon: Instagram, color: "text-primary", bg: "bg-primary/10" },
];

function CrmHub() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ leads: 0, pipelineValue: 0, botConvs: 0, won: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      // Garante estágios
      await supabase.rpc("ensure_default_funnel_stages", { _user_id: user.id });

      const [{ count: leadsCount }, { data: pipeline }, { count: botCount }, { data: stages }, { data: latest }] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("pipeline_leads").select("deal_value, stage_id").eq("user_id", user.id),
        supabase.from("bot_conversations").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("funnel_stages").select("id, name").eq("user_id", user.id),
        supabase.from("leads").select("id, name, phone, source, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);

      const wonStageIds = (stages ?? []).filter((s: any) => /ganho|fechado|won/i.test(s.name)).map((s: any) => s.id);
      const won = (pipeline ?? []).filter((p: any) => wonStageIds.includes(p.stage_id)).reduce((s: number, p: any) => s + Number(p.deal_value ?? 0), 0);
      const total = (pipeline ?? []).reduce((s: number, p: any) => s + Number(p.deal_value ?? 0), 0);

      setStats({
        leads: leadsCount ?? 0,
        pipelineValue: total,
        botConvs: botCount ?? 0,
        won,
      });
      setRecentLeads(latest ?? []);
    })();
  }, [user?.id]);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="CRM" subtitle="Centro de relacionamento e atendimento" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-2xl bg-gradient-sidebar-cta p-8 text-white shadow-elegant relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="h-40 w-40" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
                <Sparkles className="h-4 w-4" /> CRM Unificado
              </div>
              <h2 className="text-3xl font-bold font-display mb-3">Tudo do seu CRM em um só lugar</h2>
              <p className="text-white/85 leading-relaxed">
                Leads, funil, bot de atendimento, automações e canais — gerencie todo o relacionamento com clientes a partir deste painel.
              </p>
            </div>
          </div>

          {/* KPIs reais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi icon={Users} label="Leads totais" value={stats.leads.toLocaleString("pt-BR")} color="text-primary" bg="bg-primary/10" />
            <Kpi icon={TrendingUp} label="Valor pipeline" value={fmt(stats.pipelineValue)} color="text-info" bg="bg-info/10" />
            <Kpi icon={DollarSign} label="Ganhos fechados" value={fmt(stats.won)} color="text-success" bg="bg-success/10" />
            <Kpi icon={MessageCircle} label="Conversas bot" value={stats.botConvs.toLocaleString("pt-BR")} color="text-warning" bg="bg-warning/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => (
              <Link
                key={m.url}
                to={m.url}
                className="group bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elegant hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-11 w-11 rounded-xl ${m.bg} ${m.color} grid place-items-center`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                </div>
                <h3 className="font-bold font-display text-base mb-1">{m.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
              </Link>
            ))}
          </div>

          {/* Leads recentes */}
          <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold font-display">Leads recentes</h3>
                <p className="text-xs text-muted-foreground">Últimos contatos cadastrados</p>
              </div>
              <Link to="/leads" className="text-xs font-bold text-primary hover:underline">Ver todos →</Link>
            </div>
            <div className="divide-y divide-border">
              {recentLeads.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Nenhum lead ainda. <Link to="/leads" className="text-primary font-bold hover:underline">Cadastre o primeiro</Link>.
                </div>
              ) : (
                recentLeads.map((l) => (
                  <div key={l.id} className="px-5 py-3 flex items-center gap-4 hover:bg-muted/30 transition">
                    <div className="h-9 w-9 rounded-xl bg-gradient-primary text-white grid place-items-center text-xs font-bold">
                      {l.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("") || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.phone || "—"}</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{l.source || "manual"}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(l.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-8 w-8 rounded-lg ${bg} ${color} grid place-items-center`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold font-display">{value}</div>
    </div>
  );
}
