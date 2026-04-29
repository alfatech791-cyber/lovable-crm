import { Wrench, Clock, CheckCircle2, AlertCircle, MoreHorizontal, Plus, Search, Filter, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type OSRow = {
  id: string;
  status: string | null;
  problem_description: string | null;
  equipment: string | null;
  estimated_cost: number | null;
  created_at: string | null;
  customer_id: string;
  customer?: { full_name: string | null } | null;
};
 
  const statusColors: Record<string, string> = {
    "open": "bg-slate-100 text-slate-700 border-slate-200",
    "in_progress": "bg-blue-50 text-blue-700 border-blue-200",
    "waiting_approval": "bg-amber-50 text-amber-700 border-amber-200",
    "approved": "bg-green-50 text-green-700 border-green-200",
    "ready": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "delivered": "bg-purple-50 text-purple-700 border-purple-200",
    "cancelled": "bg-red-50 text-red-700 border-red-200",
  };
 
  const statusLabels: Record<string, string> = {
    "open": "Aberto",
    "in_progress": "Em Andamento",
    "waiting_approval": "Aguardando Aprovação",
    "approved": "Aprovado",
    "ready": "Pronto",
    "delivered": "Entregue",
    "cancelled": "Cancelado",
  };
 
 const priorityColors = {
   "Baixa": "text-slate-500",
   "Média": "text-blue-500",
   "Alta": "text-orange-500",
   "Urgente": "text-red-600 font-bold",
 };
 
 export function OSList() {
    const { user } = useAuth();
    const [rows, setRows] = useState<OSRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
      if (!user?.id) return;
      setLoading(true);
      (async () => {
        const { data, error } = await supabase
          .from("service_orders")
          .select("id,status,problem_description,equipment,estimated_cost,created_at,customer_id,customer:customers(full_name)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) toast.error("Erro ao carregar OS: " + error.message);
        setRows((data as any) ?? []);
        setLoading(false);
      })();
    }, [user?.id]);

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      if (!q) return rows;
      return rows.filter((r) =>
        (r.customer?.full_name ?? "").toLowerCase().includes(q) ||
        (r.equipment ?? "").toLowerCase().includes(q) ||
        (r.problem_description ?? "").toLowerCase().includes(q)
      );
    }, [rows, search]);

    const stats = useMemo(() => ({
      total: rows.length,
      open: rows.filter((r) => r.status === "open").length,
      progress: rows.filter((r) => r.status === "in_progress").length,
      done: rows.filter((r) => r.status === "done").length,
    }), [rows]);

   return (
     <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input 
               placeholder="Buscar OS, cliente ou aparelho..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
               className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
             />
           </div>
           <button className="h-10 px-4 rounded-xl border border-border bg-card flex items-center gap-2 text-sm font-medium hover:bg-muted transition">
             <Filter className="h-4 w-4" /> Filtros
           </button>
         </div>
          <a href="/servicos/nova" className="h-10 px-5 rounded-xl bg-gradient-primary text-white flex items-center gap-2 text-sm font-bold shadow-glow hover:opacity-95 transition">
           <Plus className="h-4 w-4" /> Nova OS
          </a>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
            { label: "Total", value: String(stats.total), icon: Wrench, color: "text-primary" },
            { label: "Em Aberto", value: String(stats.open), icon: AlertCircle, color: "text-amber-500" },
            { label: "Em Andamento", value: String(stats.progress), icon: Clock, color: "text-blue-500" },
            { label: "Concluídas", value: String(stats.done), icon: CheckCircle2, color: "text-green-500" },
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
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Valor</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Data</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {filtered.map((os) => (
                 <tr key={os.id} className="hover:bg-muted/30 transition-colors">
                   <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-primary">{os.id.slice(0, 8)}</span>
                   </td>
                   <td className="px-6 py-4">
                      <div className="font-semibold text-sm">{os.customer?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{os.equipment ?? "—"}</div>
                   </td>
                   <td className="px-6 py-4 text-sm text-muted-foreground">
                      {os.problem_description ?? "—"}
                   </td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${statusColors[os.status || "open"] || "bg-muted"}`}>
                         {statusLabels[os.status || "open"] || "Aberto"}
                       </span>
                    </td>
                   <td className="px-6 py-4 text-xs">
                      {(os.estimated_cost ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                   </td>
                   <td className="px-6 py-4 text-xs text-muted-foreground">
                      {os.created_at ? new Date(os.created_at).toLocaleDateString("pt-BR") : "—"}
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
          {loading && (
            <div className="p-12 grid place-items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {!loading && filtered.length === 0 && (
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