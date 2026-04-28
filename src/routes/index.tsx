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
    let title = label;
    let subtitle = "Métricas e detalhes";
    let icon = TrendingUp;
    let color = "text-primary bg-primary/10";

    if (l.includes("vendas") || l.includes("faturamento") || l.includes("ticket")) {
      title = "Vendas e Faturamento";
      subtitle = "Resumo de transações financeiras";
      icon = ShoppingBag;
      color = "text-success bg-success/10";
    } else if (l.includes("os")) {
      title = "Ordens de Serviço";
      subtitle = "Serviços em andamento e pendentes";
      icon = Wrench;
      color = "text-warning bg-warning/10";
    } else if (l.includes("estoque")) {
      title = "Alertas de Estoque";
      subtitle = "Produtos que precisam de reposição";
      icon = Box;
      color = "text-destructive bg-destructive/10";
    } else if (l.includes("leads")) {
      title = "Novos Leads";
      subtitle = "Interessados captados hoje";
      icon = Users;
      color = "text-info bg-info/10";
    }

    setModalContent({
      title,
      subtitle,
      icon,
      color,
      items: []
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {modalContent && (() => {
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
                {modalContent.items.length > 0 ? modalContent.items.map((item) => (
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
                 )) : (
                  <div className="py-12 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-muted/50 grid place-items-center mx-auto mb-3">
                      <ModalIcon className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground italic">Sem registros para exibir</p>
                  </div>
                 )}
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/20">
              <button className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                Ver todos os registros
              </button>
            </div>
          </div>
         </div>
        );
      })()}

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
