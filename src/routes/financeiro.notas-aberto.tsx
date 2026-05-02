import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, Fragment } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader2, 
  FileText, 
  Clock, 
  AlertCircle,
   CheckCircle2,
   Truck,
   Package,
   Receipt,
   ChevronDown,
   ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, isAfter, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/financeiro/notas-aberto")({
  component: NotasAbertoPage,
});

function NotasAbertoPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("finance_transactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("due_date", { ascending: true });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Erro ao carregar notas em aberto:", error);
      toast.error("Erro ao carregar notas em aberto.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleMarkAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from("finance_transactions")
        .update({ 
          status: "paid",
          payment_date: new Date().toISOString().split('T')[0]
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Nota marcada como paga!");
      fetchTransactions();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao marcar como paga.");
    }
  };

   const filteredTransactions = transactions.filter(t => 
     t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (t.supplier_name && t.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    totalPending: transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0),
    overdueCount: transactions.filter(t => t.due_date && isAfter(new Date(), parseISO(t.due_date))).length,
    overdueAmount: transactions
      .filter(t => t.due_date && isAfter(new Date(), parseISO(t.due_date)))
      .reduce((acc, curr) => acc + (curr.amount || 0), 0),
    count: transactions.length
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Notas em Aberto" subtitle="Gestão de contas a pagar e receber pendentes" toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-5 border-none bg-gradient-to-br from-amber-500/10 to-transparent shadow-sm border border-amber-100 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-amber-500 text-white grid place-items-center shadow-lg shadow-amber-200">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter bg-amber-50 px-2 py-1 rounded-full">Total em Aberto</span>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valor Pendente</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {stats.totalPending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-bold">{stats.count} registros pendentes</div>
            </Card>

            <Card className="p-5 border-none bg-gradient-to-br from-red-500/10 to-transparent shadow-sm border border-red-100 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-red-500 text-white grid place-items-center shadow-lg shadow-red-200">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-full">Atenção</span>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valor Vencido</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {stats.overdueAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <div className="text-[10px] text-red-600 mt-1 font-bold">{stats.overdueCount} contas em atraso</div>
            </Card>

            <Card className="p-5 border-border shadow-sm rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Projeção Próximos 7 dias</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {transactions
                  .filter(t => t.due_date && !isAfter(new Date(), parseISO(t.due_date)) && isAfter(parseISO(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')), parseISO(t.due_date)))
                  .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Buscar notas..." 
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200">
                <Filter className="h-4 w-4 mr-2" /> Filtros
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold px-6">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </div>
          </div>

          <Card className="border-border shadow-sm overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimento</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoria</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Produtos</th>
                     <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground mt-2 text-xs">Carregando notas em aberto...</p>
                      </td>
                    </tr>
                   ) : filteredTransactions.length > 0 ? filteredTransactions.map(t => {
                     const isOverdue = t.due_date && isAfter(new Date(), parseISO(t.due_date));
                     const isExpanded = expandedRow === t.id;
                     return (
                       <Fragment key={t.id}>
                       <tr className="hover:bg-slate-50/50 transition-colors group">
                         <td className={`px-6 py-4 text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            {t.due_date ? format(parseISO(t.due_date), "dd/MM/yyyy", { locale: ptBR }) : '—'}
                            {isOverdue && <span className="bg-red-50 text-[8px] px-1.5 py-0.5 rounded text-red-600 border border-red-100">VENCIDO</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {t.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                            </div>
                             <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-900">{t.description}</span>
                               {t.supplier_name && (
                                 <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium mt-0.5">
                                   <Truck className="h-3 w-3" />
                                   Fornecedor: {t.supplier_name}
                                 </div>
                               )}
                               {t.invoice_number && (
                                 <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                   <Receipt className="h-3 w-3" />
                                   NF: {t.invoice_number}
                                 </div>
                               )}
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tight border border-slate-200">
                            {t.category || "Geral"}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-black text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'} {(t.amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase bg-amber-100 text-amber-700">
                            Pendente
                          </span>
                        </td>
                         <td className="px-6 py-4 text-center">
                           {t.products_list && t.products_list.length > 0 ? (
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="h-7 text-[10px] font-bold gap-1"
                               onClick={() => setExpandedRow(isExpanded ? null : t.id)}
                             >
                               <Package className="h-3 w-3" />
                               {t.products_list.length} {t.products_list.length === 1 ? 'item' : 'itens'}
                               {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                             </Button>
                           ) : (
                             <span className="text-[10px] text-muted-foreground italic">—</span>
                           )}
                         </td>
                         <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-green-600 hover:bg-green-50"
                              onClick={() => handleMarkAsPaid(t.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Baixar
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && t.products_list && (
                         <tr className="bg-slate-50/80">
                           <td colSpan={7} className="px-6 py-3">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                               {t.products_list.map((item: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                   <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                     <Package className="h-4 w-4" />
                                   </div>
                                   <div className="flex-1">
                                     <div className="text-[11px] font-bold text-slate-900 leading-tight">{item.name || item.description || 'Produto'}</div>
                                     <div className="text-[10px] text-muted-foreground font-medium">
                                       {item.quantity && `${item.quantity} un`}
                                       {item.price && ` • R$ ${item.price.toLocaleString('pt-BR')}`}
                                     </div>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </td>
                         </tr>
                       )}
                      </Fragment>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground italic">
                        Nenhuma nota em aberto encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}