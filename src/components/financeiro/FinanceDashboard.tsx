import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, Building2, Receipt, ArrowRight, TrendingUp, TrendingDown, PieChart, Plus, Calendar } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

  const data: { name: string; receitas: number; despesas: number }[] = [];
  
  const despesasPorCategoria: { name: string; value: number; color: string }[] = [];

export function FinanceDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard Financeiro</h1>
          <p className="text-muted-foreground text-sm font-medium">Acompanhe a saúde financeira da sua empresa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-bold rounded-xl border-slate-200 shadow-sm">
            <Calendar className="h-4 w-4" /> Últimos 30 dias
          </Button>
          <Button size="sm" className="h-9 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200">
            <Plus className="h-4 w-4" /> Novo Lançamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-green-100/50 text-green-600 grid place-items-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tighter">+15.2% vs mês ant.</span>
            </div>
            <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Receitas (Mês)</div>
            <div className="text-3xl font-black mt-1 flex items-baseline gap-1 text-slate-900">
              <span className="text-sm font-bold text-muted-foreground">R$</span>
                0,00
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-red-100/50 text-red-600 grid place-items-center">
                <TrendingDown className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-tighter">-2.4% vs mês ant.</span>
            </div>
            <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Despesas (Mês)</div>
            <div className="text-3xl font-black mt-1 flex items-baseline gap-1 text-slate-900">
              <span className="text-sm font-bold text-muted-foreground">R$</span>
                0,00
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100/50 text-blue-600 grid place-items-center">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">Meta: 92% atingida</span>
            </div>
            <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Saldo Projetado</div>
            <div className="text-3xl font-black mt-1 text-blue-600 flex items-baseline gap-1">
              <span className="text-sm font-bold">R$</span>
                0,00
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900">
                <TrendingUp className="h-4 w-4 text-blue-600" /> Fluxo de Caixa (6 Meses)
              </CardTitle>
              <CardDescription className="font-medium text-xs">Comparativo entre entradas e saídas mensais</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <span>Receitas</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <span>Despesas</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                    tickFormatter={(value) => `R$ ${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="receitas" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReceitas)" />
                  <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDespesas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-7">
            <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900">
              <PieChart className="h-4 w-4 text-blue-600" /> Gastos por Categoria
            </CardTitle>
            <CardDescription className="font-medium text-xs">Distribuição de despesas no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={despesasPorCategoria} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 'bold', fontSize: '12px' }}
                  />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                      {despesasPorCategoria.length > 0 && despesasPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
              <div className="space-y-3">
                {despesasPorCategoria.length > 0 ? despesasPorCategoria.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-xs font-bold text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">R$ {cat.value.toLocaleString('pt-BR')}</span>
                  </div>
                )) : (
                  <div className="text-center text-xs text-muted-foreground py-4 italic">Sem categorias registradas</div>
                )}
              </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm flex flex-col rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900">
              <Building2 className="h-4 w-4 text-blue-600" /> Contas e Bancos
            </CardTitle>
            <button 
              onClick={() => navigate({ to: "/financeiro/caixa" })}
              className="text-[11px] font-black text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              Ver Tudo <ArrowRight className="h-3 w-3" />
            </button>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-xs text-muted-foreground py-8 italic border border-dashed border-slate-100 rounded-xl">
                Nenhuma conta cadastrada
              </div>
            </CardContent>
        </Card>

        <Card className="border-border shadow-sm flex flex-col rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900">
              <Receipt className="h-4 w-4 text-blue-600" /> Contas a Pagar/Receber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => navigate({ to: "/financeiro/contas-receber" })}
                className="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition text-left group"
              >
                <div className="text-[10px] font-black text-blue-600 uppercase mb-1 flex items-center justify-between tracking-widest">
                  <span>A Receber</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="text-lg font-black text-blue-700">R$ 0,00</div>
              </button>
              <button 
                onClick={() => navigate({ to: "/financeiro/contas-pagar" })}
                className="p-4 rounded-2xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition text-left group"
              >
                <div className="text-[10px] font-black text-red-600 uppercase mb-1 flex items-center justify-between tracking-widest">
                  <span>A Pagar</span>
                  <ArrowDownRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="text-lg font-black text-red-700">R$ 0,00</div>
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center text-xs text-muted-foreground py-8 italic border border-dashed border-slate-100 rounded-xl">
                Nenhum lançamento recente
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}