import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { kpis } from "@/lib/mock";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { OriginDonut } from "@/components/dashboard/OriginDonut";
import { ChannelMini } from "@/components/dashboard/ChannelMini";
import { Funnel } from "@/components/dashboard/Funnel";
import { MessagesPanel } from "@/components/dashboard/MessagesPanel";
import { TasksCard, AutomationsCard, AgendaCard, DispatchCard } from "@/components/dashboard/SidePanels";
import { RecentService, RecentLeads } from "@/components/dashboard/RecentPanels";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useState } from "react";
import { X, ShoppingBag, Clock, User, Wrench, Box, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel — ConectaCRM" },
      { name: "description", content: "Dashboard ConectaCRM: leads, vendas, atendimentos e automações em um só lugar." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    items: any[];
  } | null>(null);

  const openModal = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("vendas") || l.includes("faturamento") || l.includes("ticket")) {
      setModalContent({
        title: "Vendas e Faturamento",
        subtitle: "Resumo de transações financeiras",
        icon: ShoppingBag,
        color: "text-success bg-success/10",
        items: [
          { id: "1", title: "Marcos Oliveira", desc: "iPhone 15 Pro Max 256GB", meta: "R$ 7.899,00", time: "14:20", badge: "Confirmado" },
          { id: "2", title: "Ana Beatriz", desc: "Capa Silicone + Película 3D", meta: "R$ 209,80", time: "13:15", badge: "Confirmado" },
          { id: "3", title: "Cláudio Sampaio", desc: "Samsung Galaxy S24 Ultra", meta: "R$ 6.599,00", time: "11:05", badge: "Confirmado" },
          { id: "4", title: "Julia Martins", desc: "Carregador 20W Apple", meta: "R$ 199,00", time: "09:45", badge: "Confirmado" },
        ]
      });
    } else if (l.includes("os")) {
      setModalContent({
        title: "Ordens de Serviço",
        subtitle: "Serviços em andamento e pendentes",
        icon: Wrench,
        color: "text-warning bg-warning/10",
        items: [
          { id: "OS1", title: "João Silva", desc: "iPhone 13 - Troca de Tela", meta: "Urgente", time: "Aguardando", badge: "Em análise" },
          { id: "OS2", title: "Maria Oliveira", desc: "MacBook Pro - Limpeza", meta: "Normal", time: "Pendente", badge: "Aguardando" },
          { id: "OS3", title: "Pedro Santos", desc: "S22 - Conector Carga", meta: "Alta", time: "Pronto", badge: "Concluído" },
        ]
      });
    } else if (l.includes("estoque")) {
      setModalContent({
        title: "Alertas de Estoque",
        subtitle: "Produtos que precisam de reposição",
        icon: Box,
        color: "text-destructive bg-destructive/10",
        items: [
          { id: "P1", title: "iPhone 15 Pro Max", desc: "Estoque: 2 unidades", meta: "Mín: 5", time: "Smartphones", badge: "Crítico" },
          { id: "P2", title: "Carregador MagSafe", desc: "Estoque: 1 unidade", meta: "Mín: 10", time: "Acessórios", badge: "Repor" },
          { id: "P3", title: "Cabo USB-C 2m", desc: "Estoque: 0 unidades", meta: "Mín: 15", time: "Cabos", badge: "Esgotado" },
        ]
      });
    } else if (l.includes("leads")) {
      setModalContent({
        title: "Novos Leads",
        subtitle: "Interessados captados hoje",
        icon: Users,
        color: "text-info bg-info/10",
        items: [
          { id: "L1", title: "Arthur Mendes", desc: "Interesse: MacBook Air M2", meta: "WhatsApp", time: "10 min", badge: "Novo" },
          { id: "L2", title: "Julia Rosa", desc: "Interesse: iPhone 15", meta: "Instagram", time: "45 min", badge: "Novo" },
          { id: "L3", title: "Fernando Paz", desc: "Interesse: Manutenção", meta: "Facebook", time: "2h", badge: "Atendimento" },
        ]
      });
    } else {
      setModalContent({
        title: label,
        subtitle: "Métricas e detalhes",
        icon: TrendingUp,
        color: "text-primary bg-primary/10",
        items: [
          { id: "D1", title: "Análise de Dados", desc: "Informação processada com sucesso", meta: "Relatório", time: "Hoje", badge: "Estável" },
        ]
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {modalContent && (
        (() => {
          const ModalIcon = modalContent.icon;
          return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalContent(null)} />
          <div className="relative w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${modalContent.color} grid place-items-center`}>
                  <ModalIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{modalContent.title}</h3>
                  <p className="text-xs text-muted-foreground">{modalContent.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setModalContent(null)} className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {modalContent.items.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted transition-colors group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-primary text-white flex items-center justify-center text-xs font-bold">
                          {item.title.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold">{item.title}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3" /> {item.time} · {item.meta}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          item.badge === "Crítico" || item.badge === "Esgotado" ? "bg-destructive/10 text-destructive" :
                          item.badge === "Urgente" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                        }`}>
                          {item.badge}
                        </div>
                      </div>
                    </div>
                    <div className="pl-12">
                      <div className="text-[12px] text-foreground/80 bg-background/50 rounded-lg p-2 border border-border/30">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/20">
              <button className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Ver todos os registros
              </button>
            </div>
          </div>
        </div>
      )}

      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          title="Olá, Renato! 👋" 
          subtitle="Aqui está o resumo do seu negócio hoje." 
          toggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <QuickActions />
          <div className="space-y-5 mt-5">
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-5 min-w-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-6 gap-3">
                  {kpis.map((k) => (
                    <KpiCard 
                      key={k.label} 
                      {...k} 
                      onClick={() => openModal(k.label)} 
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                  <SalesChart />
                  <OriginDonut />
                  <ChannelMini />
                </div>

                <Funnel />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <RecentService />
                  <TasksCard />
                </div>

                <RecentLeads />
                <AutomationsCard />
              </div>

              <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-5">
                <div className="xl:sticky xl:top-20">
                  <MessagesPanel />
                </div>
                <div className="hidden xl:flex flex-col gap-5">
                  <AgendaCard />
                  <DispatchCard />
                </div>
                <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AgendaCard />
                  <DispatchCard />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
