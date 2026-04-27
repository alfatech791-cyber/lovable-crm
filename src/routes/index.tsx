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
            {/* KPIs + Messages 2-col layout */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
                  {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1"><SalesChart /></div>
                  <div className="lg:col-span-1"><OriginDonut /></div>
                  <div className="lg:col-span-1"><ChannelMini /></div>
                </div>
                <Funnel />
              </div>
              <div className="xl:row-span-1">
                <MessagesPanel />
              </div>
            </div>

            {/* Lower grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="space-y-5 xl:col-span-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <RecentService />
                  <TasksCard />
                </div>
                <RecentLeads />
                <AutomationsCard />
              </div>
              <div className="space-y-5">
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
