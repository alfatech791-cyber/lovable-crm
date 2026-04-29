import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Search, Filter, MoreHorizontal, Plus, Download, Calendar, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/financeiro/caixa")({
  component: FinanceCaixaPage,
});

function FinanceCaixaPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("finance_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Erro financeiro:", error);
      toast.error("Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    todayIncome: transactions
      .filter(t => t.type === 'income' && t.payment_date && new Date(t.payment_date).toDateString() === new Date().toDateString())
      .reduce((acc, curr) => acc + (curr.amount || 0), 0),
    todayExpense: transactions
      .filter(t => t.type === 'expense' && t.payment_date && new Date(t.payment_date).toDateString() === new Date().toDateString())
      .reduce((acc, curr) => acc + (curr.amount || 0), 0),
    balance: transactions
      .reduce((acc, curr) => acc + (curr.type === 'income' ? (curr.amount || 0) : -(curr.amount || 0)), 0),
    planned: transactions
      .filter(t => t.status === 'pending')
      .reduce((acc, curr) => acc + (curr.amount || 0), 0)
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Caixa e Bancos" subtitle="Controle detalhado de entradas e saídas" toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 border-none bg-gradient-to-br from-green-500/10 to-transparent shadow-sm border border-green-100 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-green-500 text-white grid place-items-center shadow-lg shadow-green-200">
                  <ArrowUpCircle className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter bg-green-50 px-2 py-1 rounded-full">Hoje</span>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Entradas</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {stats.todayIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </Card>
            <Card className="p-5 border-none bg-gradient-to-br from-red-500/10 to-transparent shadow-sm border border-red-100 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-red-500 text-white grid place-items-center shadow-lg shadow-red-200">
                  <ArrowDownCircle className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-full">Hoje</span>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saídas</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {stats.todayExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </Card>
            <Card className="p-5 border-border shadow-sm rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saldo Atual</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {stats.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </Card>
            <Card className="p-5 border-border shadow-sm bg-slate-900 text-white rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previsto (Pendente)</div>
              <div className="text-xl font-black mt-1 text-white">
                {stats.planned.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Buscar transação..." 
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 shadow-lg shadow-blue-200">
                <Plus className="h-4 w-4 mr-2" /> Novo Lançamento
              </Button>
            </div>
          </div>

          <Card className="border-border shadow-sm overflow-hidden rounded-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoria</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Valor</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground mt-2 text-xs">Carregando transações...</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {t.payment_date ? format(new Date(t.payment_date), "dd/MM/yyyy", { locale: ptBR }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {t.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                        </div>
                        <span className="font-bold text-sm text-slate-900">{t.description}</span>
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
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {t.status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground italic">
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </main>
      </div>
    </div>
  );
}
