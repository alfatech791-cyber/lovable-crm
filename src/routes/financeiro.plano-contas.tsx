 import { createFileRoute } from "@tanstack/react-router";
 import { AppSidebar } from "@/components/layout/Sidebar";
 import { Topbar } from "@/components/layout/Topbar";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
  import { ListTree, Plus, ChevronRight, Search, Settings2, Download, Filter, MoreVertical, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
  import { useState } from "react";

 export const Route = createFileRoute("/financeiro/plano-contas")({
   component: FinancePlanoContasPage,
 });

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function FinancePlanoContasPage() {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["chart_of_accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chart_of_accounts")
        .select("*")
        .order("code");
      if (error) throw error;
      return data || [];
    },
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const defaultAccounts = [
        { user_id: user.id, name: "RECEITAS", code: "1", type: "revenue" },
        { user_id: user.id, name: "Vendas de Produtos", code: "1.1", type: "revenue", parent_id: null },
        { user_id: user.id, name: "Vendas de Serviços", code: "1.2", type: "revenue", parent_id: null },
        { user_id: user.id, name: "DESPESAS", code: "2", type: "expense" },
        { user_id: user.id, name: "Custos Variáveis", code: "2.1", type: "expense", parent_id: null },
        { user_id: user.id, name: "Despesas Fixas", code: "2.2", type: "expense", parent_id: null },
      ];

      const { data, error } = await supabase.from("chart_of_accounts").insert(defaultAccounts).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chart_of_accounts"] });
      toast.success("Plano de contas padrão carregado!");
    },
  });

  const rootAccounts = accounts?.filter(a => !a.parent_id) || [];

  if (isLoading) return <div className="p-8">Carregando plano de contas...</div>;

  return (
     <div className="min-h-screen flex w-full bg-background">
        <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
       <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Plano de Contas" subtitle="Estrutura de categorização financeira" toggleSidebar={() => setSidebarOpen(true)} />
         <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">Estrutura de Categorias</h1>
                  <p className="text-muted-foreground text-sm font-medium">Organize suas contas para um DRE e Fluxo de Caixa precisos</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-10 rounded-xl border-slate-200 font-bold px-5">
                    <Settings2 className="h-4 w-4 mr-2" /> Configurações
                  </Button>
                  <Button className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 shadow-lg shadow-blue-200">
                    <Plus className="h-4 w-4 mr-2" /> Nova Categoria
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input placeholder="Buscar categoria ou subcategoria..." className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition shadow-sm" />
                </div>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-slate-200">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-slate-200">
                  <Download className="h-4 w-4" />
                </Button>
             </div>
             <div className="space-y-4">
               {categories.map(cat => (
                  <Card key={cat.id} className="border-border shadow-sm overflow-hidden rounded-2xl">
                    <div className={`px-5 py-4 flex items-center justify-between border-b border-slate-100 ${cat.type === 'revenue' ? 'bg-green-50/30' : 'bg-slate-50/30'}`}>
                     <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cat.type === 'revenue' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                          {cat.type === 'revenue' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </div>
                        <span className="font-black text-sm tracking-tight text-slate-900">{cat.name}</span>
                     </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                   </div>
                    <div className="p-1.5 bg-card">
                     {cat.children.map(child => (
                        <div key={child} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 rounded-xl group transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors"></div>
                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{child}</span>
                         </div>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">Editar</Button>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600">Excluir</Button>
                            <MoreVertical className="h-3.5 w-3.5 text-slate-300" />
                         </div>
                       </div>
                     ))}
                      <div className="px-6 py-2">
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                          <Plus className="h-3 w-3" /> Adicionar Subcategoria
                        </button>
                      </div>
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
