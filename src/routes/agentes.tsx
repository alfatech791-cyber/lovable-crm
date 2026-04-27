import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Headphones, Plus, MoreHorizontal, Shield, MessageSquare, Circle, Brain, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/agentes")({
  head: () => ({
    meta: [
      { title: "Agentes de Atendimento — ConectaCRM" },
      { name: "description", content: "Gerencie sua equipe de suporte e vendas." },
    ],
  }),
  component: AgentsPage,
});

const agents = [
  { id: 1, name: "Renato Silva", role: "Administrador", status: "online", instances: ["Suporte_01", "Vendas_BR"], email: "renato@conectacrm.com" },
  { id: 2, name: "Ana Clara", role: "Agente", status: "online", instances: ["Vendas_SP"], email: "ana.clara@conectacrm.com" },
  { id: 3, name: "Carlos Eduardo", role: "Agente", status: "offline", instances: [], email: "carlos.edu@conectacrm.com" },
];

function AgentsPage() {
  const handleTraining = () => {
    toast.success("Treinamento de Vendas de Celulares atualizado!", {
      description: "Agentes agora operam com o cérebro DeepSeek focado em conversão de smartphones.",
      icon: <Brain className="h-4 w-4 text-primary" />,
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Agentes de Atendimento" subtitle="Gerencie sua equipe e conexões" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display">Sua Equipe</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleTraining}
                  className="h-9 px-4 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" /> Treinar com DeepSeek
                </button>
                <button className="h-9 px-4 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-elegant hover:opacity-95 transition flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Convidar Agente
                </button>
              </div>
            </div>

            {/* AI Training Banner */}
            <div className="rounded-2xl bg-gradient-sidebar-cta p-5 text-white shadow-elegant relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition duration-500">
                <Brain className="h-32 w-32" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                    <Sparkles className="h-3.5 w-3.5" /> Inteligência Artificial Ativa
                  </div>
                  <h3 className="text-xl font-bold font-display">Especialista em Vendas de Celulares</h3>
                  <p className="text-sm text-white/70 max-w-lg">
                    Seus agentes agora usam a API DeepSeek para argumentação técnica superior, 
                    comparativo de modelos e fechamento de vendas de smartphones.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <Zap className="h-4 w-4 text-warning" />
                  <span className="text-xs font-bold uppercase tracking-wider">Motor: DeepSeek V3</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-elegant transition-all flex items-center gap-6">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-gradient-primary text-white font-bold text-lg grid place-items-center">
                    {agent.name.split(" ").map(s => s[0]).join("")}
                  </div>
                  <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${agent.status === "online" ? "bg-success" : "bg-muted-foreground"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base">{agent.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      {agent.role}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{agent.email}</div>
                </div>

                <div className="hidden lg:block w-64">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Instâncias Vinculadas
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.instances.length > 0 ? agent.instances.map(inst => (
                      <span key={inst} className="text-[10.5px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-semibold border border-primary/10">
                        {inst}
                      </span>
                    )) : (
                      <span className="text-[10.5px] text-muted-foreground italic">Nenhuma instância</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="h-10 px-4 rounded-xl border border-border hover:bg-muted text-sm font-semibold transition">
                    Editar
                  </button>
                  <button className="h-10 w-10 grid place-items-center rounded-xl border border-border hover:bg-muted text-muted-foreground">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
