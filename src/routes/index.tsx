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
 import { X, ShoppingBag, Clock, User } from "lucide-react";

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

  return (
    <div className="min-h-screen flex w-full bg-background">
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
            {/* Main Content Area */}
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-5 min-w-0">
                {/* KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-6 gap-3">
                  {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
                </div>

                {/* Charts and Funnel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                  <SalesChart />
                  <OriginDonut />
                  <ChannelMini />
                </div>

                <Funnel />

                {/* Recent Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <RecentService />
                  <TasksCard />
                </div>

                <RecentLeads />
                <AutomationsCard />
              </div>

              {/* Right Sidebar - Message Panel & Secondary Panels */}
              <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-5">
                <div className="xl:sticky xl:top-20">
                  <MessagesPanel />
                </div>
                <div className="hidden xl:flex flex-col gap-5">
                  <AgendaCard />
                  <DispatchCard />
                </div>
                {/* On smaller screens, these show at the end */}
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
