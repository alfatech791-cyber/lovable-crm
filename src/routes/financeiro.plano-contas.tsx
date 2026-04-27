 import { createFileRoute } from "@tanstack/react-router";
 import { AppSidebar } from "@/components/layout/Sidebar";
 import { Topbar } from "@/components/layout/Topbar";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { ListTree, Plus, ChevronRight } from "lucide-react";
 
 export const Route = createFileRoute("/financeiro/plano-contas")({
   component: FinancePlanoContasPage,
 });
 
 function FinancePlanoContasPage() {
   const categories = [
     { id: "1", name: "1. RECEITAS OPERACIONAIS", children: ["1.1 Vendas de Produtos", "1.2 Serviços Realizados", "1.3 Vendas de Acessórios"] },
     { id: "2", name: "2. CUSTOS OPERACIONAIS (CPV)", children: ["2.1 Aquisição de Mercadorias", "2.2 Peças de Reposição"] },
     { id: "3", name: "3. DESPESAS FIXAS", children: ["3.1 Aluguel & IPTU", "3.2 Energia & Água", "3.3 Folha de Pagamento"] },
   ];
 
   return (
     <div className="min-h-screen flex w-full bg-background">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <Topbar title="Plano de Contas" subtitle="Categorização Financeira" />
         <main className="flex-1 overflow-y-auto p-6">
           <div className="max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h2 className="text-xl font-bold">Estrutura de Categorias</h2>
                 <p className="text-sm text-muted-foreground mt-1">Organize suas receitas e despesas para um DRE preciso.</p>
               </div>
               <Button className="bg-gradient-primary shadow-glow">
                 <Plus className="h-4 w-4 mr-2" /> Nova Categoria
               </Button>
             </div>
             <div className="space-y-4">
               {categories.map(cat => (
                 <Card key={cat.id} className="border-border/50 overflow-hidden">
                   <div className="bg-muted/30 px-5 py-4 flex items-center justify-between border-b border-border/50">
                     <div className="flex items-center gap-3">
                       <ListTree className="h-5 w-5 text-primary" />
                       <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                     </div>
                     <Button variant="ghost" size="sm" className="h-8">Editar</Button>
                   </div>
                   <div className="p-2 bg-card">
                     {cat.children.map(child => (
                       <div key={child} className="flex items-center justify-between px-8 py-3 hover:bg-muted/50 rounded-lg group transition-colors">
                         <div className="flex items-center gap-2">
                           <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                           <span className="text-sm font-medium">{child}</span>
                         </div>
                         <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                           <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold">Remover</Button>
                           <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold">Mover</Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </Card>
               ))}
             </div>
           </div>
         </main>
       </div>
     </div>
   );
 }
