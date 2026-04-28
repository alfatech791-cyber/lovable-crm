  import { createFileRoute } from "@tanstack/react-router";
  import { useState } from "react";
 import { AppSidebar } from "@/components/layout/Sidebar";
  import { Topbar } from "@/components/layout/Topbar";
  import { Card } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Wallet, ArrowUpCircle, ArrowDownCircle, Search, Filter, MoreHorizontal, Plus, Download, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
 
export const Route = createFileRoute("/financeiro/caixa")({
  component: FinanceCaixaPage,
});

function FinanceCaixaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const transactions: any[] = [];

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
              <div className="text-xl font-black text-slate-900 mt-1">R$ 0,00</div>
            </Card>
            <Card className="p-5 border-none bg-gradient-to-br from-red-500/10 to-transparent shadow-sm border border-red-100 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-red-500 text-white grid place-items-center shadow-lg shadow-red-200">
                  <ArrowDownCircle className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-full">Hoje</span>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saídas</div>
              <div className="text-xl font-black text-slate-900 mt-1">R$ 0,00</div>
            </Card>
            <Card className="p-5 border-border shadow-sm rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saldo Atual</div>
              <div className="text-xl font-black text-slate-900 mt-1">R$ 0,00</div>
            </Card>
            <Card className="p-5 border-border shadow-sm bg-slate-900 text-white rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previsto (Mês)</div>
              <div className="text-xl font-black mt-1 text-white">R$ 0,00</div>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input placeholder="Buscar transação por descrição ou categoria..." className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition shadow-sm" />
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold px-5">
                <Filter className="h-4 w-4 mr-2" /> Filtros
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold px-5">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
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
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Conta / Banco</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoria</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Valor</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length > 0 ? transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{t.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === 'Entrada' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {t.type === 'Entrada' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                        </div>
                        <span className="font-bold text-sm text-slate-900">{t.desc}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{t.account}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tight border border-slate-200">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-black text-sm ${t.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'Entrada' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${t.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground italic">
                      Nenhuma transação encontrada no período
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
