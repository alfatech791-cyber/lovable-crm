 import { PageHeader } from "@/components/layout/PageHeader";
 import { OSList } from "@/components/servicos/OSList";
 
 export default function OSDashboardPage() {
   return (
     <div className="flex flex-col h-full bg-background">
       <PageHeader title="Dashboard de Serviços" />
       <main className="flex-1 overflow-y-auto p-6">
         <div className="mb-6 p-8 rounded-2xl bg-gradient-primary text-white shadow-glow">
           <h2 className="text-2xl font-black mb-2">Visão Geral da Assistência</h2>
           <p className="opacity-90">Acompanhe o desempenho técnico e financeiro do seu laboratório.</p>
         </div>
         <OSList />
       </main>
     </div>
   );
 }