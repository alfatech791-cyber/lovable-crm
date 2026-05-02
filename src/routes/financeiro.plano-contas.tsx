 import { createFileRoute } from "@tanstack/react-router";
 import { AppSidebar } from "@/components/layout/Sidebar";
 import { Topbar } from "@/components/layout/Topbar";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
  import { ListTree, Plus, ChevronRight, Search, Settings2, Download, Filter, MoreVertical, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Info, HelpCircle } from "lucide-react";
  import { useState } from "react";
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Textarea } from "@/components/ui/textarea";

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
  const [newAccount, setNewAccount] = useState({ name: '', code: '', type: 'revenue', parent_id: null as string | null, description: '' });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");
      const { error } = await supabase.from("chart_of_accounts").insert({ ...data, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chart_of_accounts"] });
      toast.success("Conta criada com sucesso!");
      setIsModalOpen(false);
      setNewAccount({ name: '', code: '', type: 'revenue', parent_id: null, description: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chart_of_accounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chart_of_accounts"] });
      toast.success("Conta removida com sucesso!");
    },
  });

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

  function AccountItem({ account, allAccounts }: { account: any, allAccounts: any[] }) {
    const children = allAccounts.filter(a => a.parent_id === account.id);
    const hasChildren = children.length > 0;
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <Card className="border-border shadow-sm overflow-hidden rounded-2xl mb-4">
        <div className={`px-5 py-4 flex items-center justify-between border-b border-slate-100 ${account.type === 'revenue' ? 'bg-green-50/30' : account.type === 'expense' ? 'bg-red-50/30' : 'bg-slate-50/30'}`}>
          <div className="flex items-center gap-3">
            {hasChildren && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-slate-200 rounded transition-colors">
                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${account.type === 'revenue' ? 'bg-green-100 text-green-600' : account.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
              {account.type === 'revenue' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-slate-900">{account.code} - {account.name}</span>
              {account.description && <span className="text-[10px] text-slate-500 font-medium">{account.description}</span>}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
        {isExpanded && (
          <div className="p-1.5 bg-card space-y-1">
            {children.map(child => (
              <div key={child.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 rounded-xl group transition-all ml-4 border-l-2 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${account.type === 'revenue' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{child.code} - {child.name}</span>
                    {child.description && <span className="text-[10px] text-slate-400">{child.description}</span>}
                  </div>
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
        )}
      </Card>
    );
  }

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
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 shadow-lg shadow-blue-200"
                >
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
