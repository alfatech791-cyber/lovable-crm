import { createFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
 import { 
   BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, 
   Filter, ArrowUpRight, Shield, PieChart, Target, Zap, 
   ArrowDownRight, ChevronRight, MoreHorizontal, UserCheck
 } from "lucide-react";
 import { SalesChart } from "@/components/dashboard/SalesChart";
 import { 
   BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, 
   PieChart as RePieChart, Pie
 } from "recharts";
 import { funnelData, originData, topPerformers } from "@/lib/mock";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — ConectaCRM" }, { name: "description", content: "Métricas avançadas de vendas" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin' || !profile;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Acesso Negado" subtitle="Você não tem permissão para ver esta página" />
          <main className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Página Restrita</h2>
              <p className="text-muted-foreground mb-8">O seu nível de acesso não permite visualizar relatórios avançados.</p>
              <Link to="/" className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-glow">
                Voltar ao Início
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }
   return (
     <div className="min-h-screen flex w-full bg-[#F8FAFC]">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <Topbar title="Métricas & Relatórios" subtitle="Análise detalhada do seu desempenho comercial" />
         
         <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {/* Toolbar */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
             <div className="flex flex-wrap items-center gap-2">
               <div className="flex p-1 bg-white border border-border rounded-xl shadow-sm">
                 {["Hoje", "7D", "30D", "12M", "Tudo"].map((p) => (
                   <button key={p} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${p === "30D" ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-muted"}`}>
                     {p}
                   </button>
                 ))}
               </div>
               <button className="h-10 px-4 rounded-xl border border-border bg-white text-[13px] font-bold shadow-sm flex items-center gap-2 hover:bg-muted transition-colors">
                 <Calendar className="h-4 w-4 text-primary" /> 01/04/2024 - 30/04/2024
               </button>
               <button className="h-10 px-4 rounded-xl border border-border bg-white text-[13px] font-bold shadow-sm flex items-center gap-2 hover:bg-muted transition-colors">
                 <Filter className="h-4 w-4 text-primary" /> Todos Agentes
               </button>
             </div>
             <div className="flex items-center gap-2">
               <button className="h-10 px-4 rounded-xl bg-white border border-border text-foreground text-[13px] font-bold shadow-sm hover:bg-muted transition-colors flex items-center gap-2">
                 <Download className="h-4 w-4" /> Exportar CSV
               </button>
               <button className="h-10 px-4 rounded-xl bg-primary text-white text-[13px] font-bold shadow-elegant hover:opacity-90 transition flex items-center gap-2">
                 <Zap className="h-4 w-4 fill-white" /> Relatório IA
               </button>
             </div>
           </div>
 
           {/* Main Stats Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             {[
               { label: "Faturamento", value: "R$ 145.800", trend: "+12.5%", isUp: true, icon: DollarSign, bg: "bg-primary/10", text: "text-primary" },
               { label: "Leads Totais", value: "2.861", trend: "+18.2%", isUp: true, icon: Users, bg: "bg-info/10", text: "text-info" },
               { label: "Conversão", value: "5.2%", trend: "-2.1%", isUp: false, icon: Target, bg: "bg-success/10", text: "text-success" },
               { label: "Ticket Médio", value: "R$ 1.550", trend: "+4.3%", isUp: true, icon: TrendingUp, bg: "bg-warning/10", text: "text-warning" },
             ].map((stat, i) => (
               <div key={i} className="bg-white border border-border rounded-2xl p-5 shadow-card hover:border-primary/20 transition-colors group">
                 <div className="flex items-start justify-between mb-4">
                   <div className={`h-11 w-11 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center`}>
                     <stat.icon className="h-5 w-5" />
                   </div>
                   <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${stat.isUp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                     {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                     {stat.trend}
                   </div>
                 </div>
                 <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-bold font-display tracking-tight group-hover:text-primary transition-colors">{stat.value}</h3>
               </div>
             ))}
           </div>
 
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
             {/* Sales performance - Larger card */}
             <div className="lg:col-span-2 flex flex-col gap-8">
               <div className="bg-white border border-border rounded-2xl shadow-card overflow-hidden">
                 <div className="p-6 border-b border-border flex items-center justify-between">
                   <div>
                     <h3 className="text-lg font-bold">Desempenho de Vendas</h3>
                     <p className="text-sm text-muted-foreground font-medium">Faturamento diário nos últimos 30 dias</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground px-3 py-1.5 border border-border rounded-lg">
                       <div className="h-2 w-2 rounded-full bg-primary" /> Vendas
                     </div>
                   </div>
                 </div>
                 <div className="p-6">
                   <SalesChart />
                 </div>
               </div>
 
               {/* Conversion Funnel */}
               <div className="bg-white border border-border rounded-2xl shadow-card">
                 <div className="p-6 border-b border-border">
                   <h3 className="text-lg font-bold">Funil de Conversão</h3>
                   <p className="text-sm text-muted-foreground font-medium">Eficiência por etapa do processo</p>
                 </div>
                 <div className="p-6">
                   <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={funnelData} margin={{ left: 40, right: 40 }}>
                         <XAxis type="number" hide />
                         <YAxis 
                           dataKey="name" 
                           type="category" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fontSize: 13, fontWeight: 700, fill: "var(--color-foreground)" }}
                         />
                         <Tooltip 
                           cursor={{ fill: "transparent" }}
                           content={({ active, payload }) => {
                             if (active && payload && payload.length) {
                               return (
                                 <div className="bg-white border border-border p-3 rounded-xl shadow-elegant">
                                   <p className="text-[13px] font-bold text-foreground">{payload[0].payload.name}</p>
                                   <p className="text-lg font-bold text-primary">{payload[0].value} <span className="text-xs text-muted-foreground">leads</span></p>
                                 </div>
                               );
                             }
                             return null;
                           }}
                         />
                         <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                           {funnelData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                     {[
                       { label: "Lead p/ Qual.", value: "65%", status: "success" },
                       { label: "Qual. p/ Prop.", value: "64%", status: "success" },
                       { label: "Prop. p/ Negoc.", value: "66%", status: "warning" },
                       { label: "Conversão Final", value: "15%", status: "primary" },
                     ].map((m, i) => (
                       <div key={i} className="text-center">
                         <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">{m.label}</p>
                         <p className={`text-lg font-bold text-${m.status}`}>{m.value}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Sidebar Column */}
             <div className="flex flex-col gap-8">
               {/* Top Performers */}
               <div className="bg-white border border-border rounded-2xl shadow-card">
                 <div className="p-6 border-b border-border flex items-center justify-between">
                   <h3 className="text-lg font-bold">Top Agentes</h3>
                   <button className="text-primary hover:underline text-xs font-bold">Ver tudo</button>
                 </div>
                 <div className="p-4 space-y-2">
                   {topPerformers.map((agent, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-border">
                       <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                           {agent.avatar}
                         </div>
                         <div>
                           <p className="text-sm font-bold leading-none mb-1">{agent.name}</p>
                           <p className="text-xs text-muted-foreground font-medium">{agent.sales} vendas efetuadas</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-sm font-bold text-foreground mb-1">{agent.revenue}</p>
                         <p className="text-[10px] font-bold text-success flex items-center justify-end gap-0.5">
                           <ArrowUpRight className="h-2.5 w-2.5" /> {agent.trend}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="p-4 pt-0">
                   <button className="w-full py-3 rounded-xl bg-slate-50 text-muted-foreground text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                     <UserCheck className="h-4 w-4" /> Relatório Completo de Equipe
                   </button>
                 </div>
               </div>
 
               {/* Lead Origin */}
               <div className="bg-white border border-border rounded-2xl shadow-card overflow-hidden">
                 <div className="p-6 border-b border-border">
                   <h3 className="text-lg font-bold">Origem dos Leads</h3>
                   <p className="text-sm text-muted-foreground font-medium">Distribuição por canal</p>
                 </div>
                 <div className="p-6">
                   <div className="h-[220px] w-full relative">
                     <ResponsiveContainer width="100%" height="100%">
                       <RePieChart>
                         <Pie
                           data={originData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={85}
                           paddingAngle={8}
                           dataKey="value"
                         >
                           {originData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Pie>
                         <Tooltip 
                           content={({ active, payload }) => {
                             if (active && payload && payload.length) {
                               return (
                                 <div className="bg-white border border-border p-2 rounded-lg shadow-elegant">
                                   <p className="text-[11px] font-bold">{payload[0].name}: {payload[0].value}%</p>
                                 </div>
                               );
                             }
                             return null;
                           }}
                         />
                       </RePieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <PieChart className="h-6 w-6 text-muted-foreground/30 mb-1" />
                       <span className="text-xs font-bold text-muted-foreground uppercase">Mix</span>
                     </div>
                   </div>
                   <div className="space-y-3 mt-4">
                     {originData.map((item, i) => (
                       <div key={i} className="flex items-center justify-between group cursor-default">
                         <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                           <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="text-sm font-bold">{item.value}%</span>
                           <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                             <div className="h-full rounded-full" style={{ backgroundColor: item.color, width: `${item.value}%` }} />
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </main>
       </div>
     </div>
   );
}
