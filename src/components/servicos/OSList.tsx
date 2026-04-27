 import { Wrench, Clock, CheckCircle2, AlertCircle, MoreHorizontal, Plus, Search, Filter } from "lucide-react";
 import { serviceOrders } from "@/lib/mock";
 
 const statusColors = {
   "Aguardando": "bg-slate-100 text-slate-700 border-slate-200",
   "Em Análise": "bg-blue-50 text-blue-700 border-blue-200",
   "Aprovado": "bg-amber-50 text-amber-700 border-amber-200",
   "Pronto": "bg-green-50 text-green-700 border-green-200",
   "Entregue": "bg-purple-50 text-purple-700 border-purple-200",
 };
 
 const priorityColors = {
   "Baixa": "text-slate-500",
   "Média": "text-blue-500",
   "Alta": "text-orange-500",
   "Urgente": "text-red-600 font-bold",
 };
 
 export function OSList() {
   return (
     <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input 
               placeholder="Buscar OS, cliente ou aparelho..." 
               className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
             />
           </div>
           <button className="h-10 px-4 rounded-xl border border-border bg-card flex items-center gap-2 text-sm font-medium hover:bg-muted transition">
             <Filter className="h-4 w-4" /> Filtros
           </button>
         </div>
         <button className="h-10 px-5 rounded-xl bg-gradient-primary text-white flex items-center gap-2 text-sm font-bold shadow-glow hover:opacity-95 transition">
           <Plus className="h-4 w-4" /> Nova OS
         </button>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: "Total do Mês", value: "48", icon: Wrench, color: "text-primary" },
           { label: "Em Bancada", value: "12", icon: Clock, color: "text-blue-500" },
           { label: "Aguardando Peça", value: "5", icon: AlertCircle, color: "text-amber-500" },
           { label: "Prontas p/ Retirada", value: "8", icon: CheckCircle2, color: "text-green-500" },
         ].map(stat => (
           <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
             <div className={`h-12 w-12 rounded-xl bg-muted/50 grid place-items-center ${stat.color}`}>
               <stat.icon className="h-6 w-6" />
             </div>
             <div>
               <div className="text-2xl font-black">{stat.value}</div>
               <div className="text-xs text-muted-foreground">{stat.label}</div>
             </div>
           </div>
         ))}
       </div>
 
       <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border bg-muted/30">
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Cliente / Aparelho</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Problema Relatado</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Prioridade</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Data</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {serviceOrders.map((os) => (
                 <tr key={os.id} className="hover:bg-muted/30 transition-colors">
                   <td className="px-6 py-4">
                     <span className="font-mono text-xs font-bold text-primary">{os.id}</span>
                   </td>
                   <td className="px-6 py-4">
                     <div className="font-semibold text-sm">{os.customer}</div>
                     <div className="text-xs text-muted-foreground">{os.device}</div>
                   </td>
                   <td className="px-6 py-4 text-sm text-muted-foreground">
                     {os.problem}
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[os.status as keyof typeof statusColors]}`}>
                       {os.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-xs">
                     <span className={priorityColors[os.priority as keyof typeof priorityColors]}>
                       {os.priority}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-xs text-muted-foreground">
                     {new Date(os.date).toLocaleDateString('pt-BR')}
                   </td>
                   <td className="px-6 py-4">
                     <button className="p-2 rounded-lg hover:bg-muted transition">
                       <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         {serviceOrders.length === 0 && (
           <div className="p-20 text-center">
             <div className="h-16 w-16 rounded-full bg-muted grid place-items-center mx-auto mb-4">
               <Wrench className="h-8 w-8 text-muted-foreground/40" />
             </div>
             <h3 className="text-lg font-bold">Nenhuma OS encontrada</h3>
             <p className="text-sm text-muted-foreground mt-1">Comece criando sua primeira ordem de serviço.</p>
           </div>
         )}
       </div>
     </div>
   );
 }