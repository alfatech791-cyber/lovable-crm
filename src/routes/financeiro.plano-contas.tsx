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
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Plano de Contas Detalhado</h1>
                <p className="text-muted-foreground text-sm font-medium">Gestão completa da hierarquia de contas financeiras</p>
              </div>
              <div className="flex gap-2">
                {rootAccounts.length === 0 && (
                  <Button 
                    onClick={() => seedMutation.mutate()} 
                    variant="outline" 
                    className="h-10 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 font-bold px-5"
                    disabled={seedMutation.isPending}
                  >
                    {seedMutation.isPending ? "Carregando..." : "Carregar Plano Padrão"}
                  </Button>
                )}
                <Button className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 shadow-lg shadow-blue-200">
                  <Plus className="h-4 w-4 mr-2" /> Novo Grupo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {rootAccounts.map(account => (
                <AccountItem key={account.id} account={account} allAccounts={accounts || []} />
              ))}
              {rootAccounts.length === 0 && !seedMutation.isPending && (
                <Card className="p-12 text-center border-dashed border-2 flex flex-col items-center justify-center bg-slate-50/50">
                  <ListTree className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">Nenhuma conta cadastrada</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                    Comece carregando um plano de contas padrão ou crie sua própria estrutura.
                  </p>
                  <Button onClick={() => seedMutation.mutate()} className="rounded-xl">
                    Carregar Configuração Inicial
                  </Button>
                </Card>
              )}
            </div>
           </div>
         </main>
       </div>
     </div>
   );
 }
