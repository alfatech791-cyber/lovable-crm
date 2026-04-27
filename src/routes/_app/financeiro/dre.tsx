 import { Topbar } from "@/components/layout/Topbar";
 import { FinanceDashboard } from "@/components/financeiro/FinanceDashboard";
 import { DREConfig } from "@/components/financeiro/DREConfig";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 
 export default function FinanceDREPage() {
   return (
     <div className="flex flex-col h-full bg-background">
       <Topbar title="DRE Gerencial" />
       <main className="flex-1 overflow-y-auto p-6">
         <Tabs defaultValue="dre" className="space-y-6">
           <TabsList className="bg-muted/50 p-1 rounded-xl">
             <TabsTrigger value="dre" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Demonstrativo (DRE)</TabsTrigger>
             <TabsTrigger value="config" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Configuração DRE</TabsTrigger>
           </TabsList>
           
           <TabsContent value="dre" className="space-y-6">
             <FinanceDashboard />
           </TabsContent>
           
           <TabsContent value="config">
             <DREConfig />
           </TabsContent>
         </Tabs>
       </main>
     </div>
   );
 }