 import { createFileRoute } from "@tanstack/react-router";
 import { AppSidebar } from "@/components/layout/Sidebar";
 import { Topbar } from "@/components/layout/Topbar";
 import { Stockouts } from "@/components/estoque/Stockouts";
 
 export const Route = createFileRoute("/estoque/vendidos")({
   component: StockoutsPage,
 });
 
 function StockoutsPage() {
   return (
     <div className="min-h-screen flex w-full bg-background">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <Topbar title="Produtos Vendidos/Sem Estoque" subtitle="Análise de Giro e Reposição" />
         <main className="flex-1 overflow-y-auto p-6">
           <Stockouts />
         </main>
       </div>
     </div>
   );
 }
