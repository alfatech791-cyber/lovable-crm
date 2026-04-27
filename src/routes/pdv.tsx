 import { createFileRoute } from "@tanstack/react-router";
 import { AppSidebar } from "@/components/layout/Sidebar";
 import { Topbar } from "@/components/layout/Topbar";
 import { PDVInterface } from "@/components/vendas/PDVInterface";
 
 export const Route = createFileRoute("/pdv")({
   component: PDVPage,
 });
 
 function PDVPage() {
   return (
     <div className="min-h-screen flex w-full bg-background">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <Topbar title="Caixa (PDV)" subtitle="Ponto de Venda Rápido" />
         <main className="flex-1 overflow-hidden p-6">
           <PDVInterface />
         </main>
       </div>
     </div>
   );
 }
