import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { OriginDonut } from "@/components/dashboard/OriginDonut";
import { ChannelMini } from "@/components/dashboard/ChannelMini";
import { Funnel } from "@/components/dashboard/Funnel";
import { MessagesPanel } from "@/components/dashboard/MessagesPanel";
import { TasksCard, AutomationsCard, AgendaCard, DispatchCard } from "@/components/dashboard/SidePanels";
import { RecentService, RecentLeads } from "@/components/dashboard/RecentPanels";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useState, useEffect, useCallback } from "react";
import { X, ShoppingBag, Clock, User, Wrench, Box, Users, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    monthRevenue: 0,
    activeOS: 0,
    lowStock: 0,
    newLeads: 0,
    avgTicket: 0
  });

  const [modalContent, setModalContent] = useState<{
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    items: any[];
  } | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Fetch sales
      const { data: sales } = await supabase
        .from("sales_orders")
        .select("total_amount, created_at, status")
        .eq("user_id", user.id);

      // Fetch products for stock
      const { data: products } = await supabase
        .from("products")
        .select("stock_quantity, min_stock")
        .eq("user_id", user.id);

      // Fetch leads
      const { data: leads } = await supabase
        .from("leads")
        .select("created_at")
        .eq("user_id", user.id);

      // Fetch OS
      const { data: os } = await supabase
        .from("service_orders")
        .select("status")
        .eq("user_id", user.id);

      const todaySales = (sales || [])
        .filter(s => new Date(s.created_at!) >= today && s.status === 'concluded')
        .reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

      const monthRevenue = (sales || [])
        .filter(s => new Date(s.created_at!) >= firstDayMonth && s.status === 'concluded')
        .reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

      const lowStockCount = (products || [])
        .filter(p => (p.stock_quantity || 0) <= (p.min_stock || 5))
        .length;

      const newLeadsCount = (leads || [])
        .filter(l => new Date(l.created_at) >= today)
        .length;

      const activeOSCount = (os || [])
        .filter(o => o.status !== 'delivered' && o.status !== 'canceled')
        .length;

      const concludedSales = (sales || []).filter(s => s.status === 'concluded');
      const avgTicket = concludedSales.length > 0 
        ? monthRevenue / concludedSales.filter(s => new Date(s.created_at!) >= firstDayMonth).length || 0
        : 0;

      setStats({
        todaySales,
        monthRevenue,
        activeOS: activeOSCount,
        lowStock: lowStockCount,
        newLeads: newLeadsCount,
        avgTicket
      });
    } catch (error) {
      console.error("Erro dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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

  const kpis = [
    { label: "Vendas do Dia", value: stats.todaySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: "+0%", sub: "Total vendido hoje", icon: "ShoppingBag", tone: "success" },
    { label: "OS Abertas", value: String(stats.activeOS), trend: "0", sub: "Em andamento", icon: "Wrench", tone: "warning" },
    { label: "Estoque Baixo", value: String(stats.lowStock), trend: "0", sub: "Produtos críticos", icon: "Box", tone: "destructive" },
    { label: "Faturamento Mês", value: stats.monthRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: "+0%", sub: "Meta: R$ 50k", icon: "DollarSign", tone: "primary" },
    { label: "Novos Leads", value: String(stats.newLeads), trend: "0", sub: "Captados hoje", icon: "Users", tone: "info" },
    { label: "Ticket Médio", value: stats.avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: "+0%", sub: "Média mensal", icon: "TrendingUp", tone: "success" },
  ];

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
                <div className="py-12 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-muted/50 grid place-items-center mx-auto mb-3">
                    <ModalIcon className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground italic">Sem registros detalhados para exibir</p>
                </div>
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
          title={`Olá, ${user?.user_metadata?.display_name || 'Usuário'}! 👋`}
          subtitle="Aqui está o resumo do seu negócio hoje." 
          toggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <QuickActions />
          <div className="space-y-5 mt-5">
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-5 min-w-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-6 gap-3">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-28 rounded-2xl bg-card border border-border animate-pulse" />
                    ))
                  ) : kpis.map((k) => (
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
