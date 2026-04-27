import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

 import { AppSidebar } from "@/components/layout/Sidebar";
 import { Topbar } from "@/components/layout/Topbar";
 import { FinanceDashboard } from "@/components/financeiro/FinanceDashboard";
 
 export const Route = createFileRoute("/financeiro")({
   component: FinancePage,
 });
 
 function FinancePage() {
   return (
     <div className="min-h-screen flex w-full bg-background">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <Topbar title="Financeiro" subtitle="Gestão de Caixa e Bancos" />
         <main className="flex-1 overflow-y-auto p-6">
           <FinanceDashboard />
         </main>
       </div>
     </div>
   );
 }
