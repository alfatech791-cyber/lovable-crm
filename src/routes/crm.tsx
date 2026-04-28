import { createFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Sparkles, UserPlus, Trello, Bot, Zap, MessageSquare, Instagram, ArrowRight } from "lucide-react";

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
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="CRM" subtitle="Centro de relacionamento e atendimento" />
        <main className="flex-1 overflow-y-auto p-6">
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
        </main>
      </div>
    </div>
  );
}
