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

   const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Fetch sales
      const { data: sales, error: salesError } = await supabase
        .from("sales_orders")
        .select("total_amount, created_at, status")
        .eq("user_id", user.id);
      
      if (salesError) throw salesError;

      // Fetch products for stock
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("stock_quantity, min_stock")
        .eq("user_id", user.id);

      if (productsError) throw productsError;

      // Fetch leads
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("created_at")
        .eq("user_id", user.id);

      if (leadsError) throw leadsError;

      // Fetch OS
      const { data: os, error: osError } = await supabase
        .from("service_orders")
        .select("status")
        .eq("user_id", user.id);

      if (osError) throw osError;

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

       const monthSales = (sales || []).filter(s => new Date(s.created_at!) >= firstDayMonth && s.status === 'concluded');
       const avgTicket = monthSales.length > 0 ? monthRevenue / monthSales.length : 0;

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

   const kpis = [
     { label: "Vendas do Dia", value: stats.todaySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: "Vendas", sub: "Resumo diário", icon: "ShoppingBag", tone: "success" },
     { label: "OS Abertas", value: String(stats.activeOS), trend: stats.activeOS > 5 ? "Alto" : "Normal", sub: "Serviços ativos", icon: "Wrench", tone: "warning" },
     { label: "Estoque Baixo", value: String(stats.lowStock), trend: stats.lowStock > 0 ? "Crítico" : "Ok", sub: "Reposição necessária", icon: "Box", tone: "destructive" },
     { label: "Faturamento Mês", value: stats.monthRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: "Meta", sub: "Meta: R$ 50k", icon: "DollarSign", tone: "primary" },
     { label: "Novos Leads", value: String(stats.newLeads), trend: "+5", sub: "Hoje", icon: "Users", tone: "info" },
     { label: "Ticket Médio", value: stats.avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), trend: "Estável", sub: "Média 30 dias", icon: "TrendingUp", tone: "success" },
   ];

   return (
     <div className="min-h-screen flex w-full bg-background/50">
       <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          title={`Olá, ${user?.user_metadata?.display_name || 'Usuário'}! 👋`}
          subtitle="Aqui está o resumo do seu negócio hoje." 
          toggleSidebar={() => setSidebarOpen(true)}
        />
         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
           <QuickActions />
 
            <div className="flex flex-col xl:flex-row gap-6">
             <div className="flex-1 flex flex-col gap-6 min-w-0">
               <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-28 rounded-2xl bg-card border border-border animate-pulse" />
                    ))
                  ) : kpis.map((k) => (
                     <KpiCard key={k.label} {...k} />
                  ))}
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                  <SalesChart />
                  <OriginDonut />
                  <ChannelMini />
                </div>

                <Funnel />

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentService />
                  <TasksCard />
                </div>

                <RecentLeads />
                <AutomationsCard />
              </div>

              <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-6">
                <div className="xl:sticky xl:top-24">
                  <MessagesPanel />
                </div>
                <div className="hidden xl:flex flex-col gap-6">
                  <AgendaCard />
                  <DispatchCard />
                </div>
                <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AgendaCard />
                  <DispatchCard />
                </div>
              </div>
            </div>
          </main>
      </div>
    </div>
  );
}
