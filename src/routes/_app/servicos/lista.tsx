 import { Topbar } from "@/components/layout/Topbar";
 import { OSList } from "@/components/servicos/OSList";
 
 export default function OSListPage() {
   return (
     <div className="flex flex-col h-full bg-background">
       <Topbar title="Listagem de Serviços" />
       <main className="flex-1 overflow-y-auto p-6">
         <OSList />
       </main>
     </div>
   );
 }