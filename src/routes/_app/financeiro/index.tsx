 import { Topbar } from "@/components/layout/Topbar";
 import { FinanceDashboard } from "@/components/financeiro/FinanceDashboard";
 
 export default function FinanceiroPage() {
   return (
     <div className="flex flex-col h-full bg-background">
       <Topbar title="Financeiro" />
       <main className="flex-1 overflow-y-auto p-6">
         <FinanceDashboard />
       </main>
     </div>
   );
 }