 import { PageHeader } from "@/components/layout/PageHeader";
 import { OSList } from "@/components/servicos/OSList";
 
 export default function ServiceOrdersPage() {
   return (
     <div className="flex flex-col h-full bg-background">
       <PageHeader title="Ordens de Serviço" />
       <main className="flex-1 overflow-y-auto p-6">
         <OSList />
       </main>
     </div>
   );
 }