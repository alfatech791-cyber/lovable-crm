import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Zap, Plus, Play, Pause, MoreHorizontal, Settings2, Sparkles, MessageSquare, Bot, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/automacao")({
  head: () => ({ meta: [{ title: "Automação — ConectaCRM" }, { name: "description", content: "Fluxos inteligentes de atendimento" }] }),
  component: AutomationPage,
});

const mockAutomations = [
  { id: 1, name: "Boas-vindas (WhatsApp)", trigger: "Novo Lead", status: "active", fired: 1245, success: "98%" },
  { id: 2, name: "Recuperação de Carrinho", trigger: "Inatividade 24h", status: "active", fired: 432, success: "12%" },
  { id: 3, name: "Qualificação IA DeepSeek", trigger: "Primeira Mensagem", status: "paused", fired: 890, success: "85%" },
];

function AutomationPage() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Automações" subtitle="Crie fluxos de atendimento automáticos" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero Section */}
          <div className="rounded-2xl bg-gradient-sidebar-cta p-8 text-white shadow-elegant relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Zap className="h-40 w-40" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
                <Sparkles className="h-4 w-4" /> Inteligência Artificial + Automação
              </div>
              <h2 className="text-3xl font-bold font-display mb-4">Venda mais com menos esforço</h2>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                Configure robôs que qualificam leads, respondem dúvidas técnicas sobre modelos de celulares e agendam visitas automaticamente.
              </p>
              <button className="h-11 px-6 rounded-xl bg-white text-primary font-bold shadow-elegant hover:bg-white/90 transition flex items-center gap-2">
                <Plus className="h-5 w-5" strokeWidth={3} /> Criar Novo Fluxo
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Disparos", value: "2.5k", sub: "Últimos 30 dias", icon: Zap, color: "text-primary" },
              { label: "Conversão IA", value: "24%", sub: "+5% vs mês anterior", icon: Bot, color: "text-success" },
              { label: "Tempo Economizado", value: "140h", sub: "Estimado", icon: Zap, color: "text-warning" },
              { label: "Leads Qualificados", value: "856", sub: "Pela automação", icon: Zap, color: "text-info" },
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-8 w-8 rounded-lg bg-muted grid place-items-center ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Automation List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-lg font-display">Seus Fluxos Ativos</h3>
              <button className="text-sm font-bold text-primary hover:underline">Ver todos</button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {mockAutomations.map(flow => (
                <div key={flow.id} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-elegant transition-all group flex flex-col md:flex-row md:items-center gap-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-base group-hover:text-primary transition">{flow.name}</h4>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${flow.status === "active" ? "bg-success/10 text-success border border-success/20" : "bg-muted text-muted-foreground border border-border"}`}>
                        {flow.status === "active" ? "Ativo" : "Pausado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Settings2 className="h-3 w-3" /> Gatilho: <strong className="text-foreground">{flow.trigger}</strong></span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Disparos: <strong className="text-foreground">{flow.fired}</strong></span>
                      <span className="flex items-center gap-1 text-success font-bold">Taxa: {flow.success}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4 hidden xl:flex">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Passos do Fluxo</span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-lg bg-muted grid place-items-center"><Bot className="h-3 w-3 text-primary" /></div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <div className="h-6 w-6 rounded-lg bg-muted grid place-items-center"><MessageSquare className="h-3 w-3 text-success" /></div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <div className="h-6 w-6 rounded-lg bg-muted grid place-items-center text-[10px] font-bold">+2</div>
                      </div>
                    </div>
                    
                    <div className="h-10 w-[1px] bg-border mx-2 hidden md:block" />
                    
                    <button className="h-10 w-10 grid place-items-center rounded-xl bg-muted hover:bg-muted/80 transition text-foreground">
                      {flow.status === "active" ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
                    </button>
                    <button className="h-10 px-4 rounded-xl border border-border hover:bg-muted transition text-sm font-bold">Editar</button>
                    <button className="h-10 w-10 grid place-items-center rounded-xl border border-border hover:bg-muted transition text-muted-foreground"><MoreHorizontal className="h-5 w-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
