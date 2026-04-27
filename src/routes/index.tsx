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
   const [showSalesModal, setShowSalesModal] = useState(false);
 
   const todaySales = [
     { id: "1", customer: "Marcos Oliveira", items: "iPhone 15 Pro Max 256GB", value: "R$ 7.899,00", time: "14:20", method: "Pix" },
     { id: "2", customer: "Ana Beatriz", items: "Capa Silicone + Película 3D", value: "R$ 209,80", time: "13:15", method: "Crédito" },
     { id: "3", customer: "Cláudio Sampaio", items: "Samsung Galaxy S24 Ultra", value: "R$ 6.599,00", time: "11:05", method: "Débito" },
     { id: "4", customer: "Julia Martins", items: "Carregador 20W Apple", value: "R$ 199,00", time: "09:45", method: "Pix" },
   ];
 
   return (
     <div className="min-h-screen flex w-full bg-background">
       {/* Sales Details Modal */}
       {showSalesModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSalesModal(false)} />
           <div className="relative w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-success/10 text-success grid place-items-center">
                   <ShoppingBag className="h-5 w-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">Vendas de Hoje</h3>
                   <p className="text-xs text-muted-foreground">{todaySales.length} transações realizadas</p>
                 </div>
               </div>
               <button onClick={() => setShowSalesModal(false)} className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                 <X className="h-5 w-5" />
               </button>
             </div>
             <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
               <div className="space-y-3">
                 {todaySales.map((sale) => (
                   <div key={sale.id} className="p-4 rounded-2xl bg-muted/40 border border-border/50 hover:bg-muted transition-colors group">
                     <div className="flex items-start justify-between mb-2">
                       <div className="flex items-center gap-3">
                         <div className="h-9 w-9 rounded-full bg-gradient-primary text-white flex items-center justify-center text-xs font-bold">
                           {sale.customer.split(" ").map(n => n[0]).join("")}
                         </div>
                         <div>
                           <div className="text-[13px] font-bold flex items-center gap-2">
                             <User className="h-3 w-3 text-muted-foreground" /> {sale.customer}
                           </div>
                           <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                             <Clock className="h-3 w-3" /> {sale.time} · {sale.method}
                           </div>
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-[14px] font-bold text-primary">{sale.value}</div>
                         <div className="text-[10px] text-success font-semibold">Confirmado</div>
                       </div>
                     </div>
                     <div className="pl-12">
                       <div className="text-[12px] text-foreground/80 bg-background/50 rounded-lg p-2 border border-border/30">
                         {sale.items}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             <div className="p-4 border-t border-border bg-muted/20">
               <button className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                 Ver relatório completo
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
            {/* Main Content Area */}
            <div className="flex flex-col xl:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-5 min-w-0">
                {/* KPIs */}
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-6 gap-3">
                   {kpis.map((k) => (
                     <KpiCard 
                       key={k.label} 
                       {...k} 
                       onClick={k.label === "Vendas do Dia" ? () => setShowSalesModal(true) : undefined} 
                     />
                   ))}
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
