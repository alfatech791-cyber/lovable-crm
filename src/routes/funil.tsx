import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
  import { Loader2, Plus, Search, Filter, LayoutGrid, List, ArrowUpDown, TrendingUp } from "lucide-react";
 import { StageColumn } from "@/components/funil/StageColumn";
 import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/funil")({
  head: () => ({
    meta: [
      { title: "Funil de Vendas — ConectaCRM" },
      { name: "description", content: "Gerencie seus leads em um Kanban intuitivo inspirado no Kommo." },
    ],
  }),
  component: FunnelPage,
});

type Stage = { id: string; name: string; color: string | null; order_index: number };
type Deal = { id: string; lead_id: string; stage_id: string; deal_value: number; priority: string | null; lead?: { name: string; phone: string | null } };

 function FunnelPage() {
   const { user } = useAuth();
   const [stages, setStages] = useState<Stage[]>([]);
   const [deals, setDeals] = useState<Deal[]>([]);
   const [leads, setLeads] = useState<{ id: string; name: string }[]>([]);
   const [loading, setLoading] = useState(true);
   const [dragId, setDragId] = useState<string | null>(null);
   const [adding, setAdding] = useState<{ stage_id: string; lead_id: string; deal_value: string } | null>(null);
   const [searchTerm, setSearchTerm] = useState("");
 
    const filteredDeals = deals.filter(d => {
      const leadName = d.lead?.name?.toLowerCase() || "";
      const leadPhone = d.lead?.phone || "";
      const search = searchTerm.toLowerCase();
      return leadName.includes(search) || leadPhone.includes(searchTerm);
    });
 
   const totalPipeline = deals.reduce((sum, d) => sum + Number(d.deal_value ?? 0), 0);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    await supabase.rpc("ensure_default_funnel_stages", { _user_id: user.id });
      const [stRes, dlRes, ldRes] = await Promise.all([
        supabase.from("funnel_stages").select("*").or(`user_id.eq.${user.id},user_id.is.null`).order("order_index"),
        supabase.from("pipeline_leads").select("*, lead:leads(name, phone, source)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("leads").select("id, name").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
     
     if (stRes.error) toast.error("Erro ao carregar estágios: " + stRes.error.message);
     if (dlRes.error) toast.error("Erro ao carregar negociações: " + dlRes.error.message);
     if (ldRes.error) toast.error("Erro ao carregar leads: " + ldRes.error.message);

     setStages((stRes.data as Stage[]) ?? []);
     setDeals((dlRes.data as Deal[]) ?? []);
     setLeads((ldRes.data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const moveDeal = async (dealId: string, newStageId: string) => {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage_id: newStageId } : d)));
    const { error } = await supabase.from("pipeline_leads").update({ stage_id: newStageId }).eq("id", dealId);
    if (error) { toast.error(error.message); load(); }
  };

  const addDeal = async () => {
    if (!user?.id || !adding?.lead_id) { toast.error("Selecione um lead"); return; }
    const { error } = await supabase.from("pipeline_leads").insert({
      user_id: user.id,
      lead_id: adding.lead_id,
      stage_id: adding.stage_id,
      deal_value: Number(adding.deal_value || 0),
    });
    if (error) toast.error(error.message);
    else { toast.success("Negociação criada"); setAdding(null); load(); }
  };

  const removeDeal = async (id: string) => {
    if (!confirm("Remover esta negociação?")) return;
    const { error } = await supabase.from("pipeline_leads").delete().eq("id", id);
    if (error) toast.error(error.message);
    else load();
  };

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Funil de Vendas" subtitle="Arraste cards entre estágios para atualizar" />
         <main className="flex-1 overflow-hidden flex flex-col bg-muted/10">
           {/* Toolbar Superior */}
           <div className="px-6 py-4 border-b border-border/50 bg-background/50 flex flex-wrap items-center justify-between gap-4">
             <div className="flex items-center gap-4">
               <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Buscar lead ou telefone..." 
                   className="pl-9 bg-background border-border/50 focus:border-primary/50 transition-all text-sm h-9"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-bold border-border/50">
                 <Filter className="h-3.5 w-3.5" /> FILTROS
               </Button>
               <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-bold border-border/50">
                 <ArrowUpDown className="h-3.5 w-3.5" /> ORDENAR
               </Button>
             </div>
 
             <div className="flex items-center gap-6">
               <div className="hidden md:flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Valor Total do Funil</span>
                 <span className="text-sm font-black text-primary">{fmt(totalPipeline)}</span>
               </div>
               <div className="h-8 w-[1px] bg-border/50 hidden md:block" />
               <div className="flex bg-muted p-1 rounded-lg border border-border/50">
                 <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md bg-background shadow-sm text-primary">
                   <LayoutGrid className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground">
                   <List className="h-4 w-4" />
                 </Button>
               </div>
               <Button className="h-9 gap-2 text-xs font-black shadow-lg shadow-primary/20" onClick={() => setAdding({ stage_id: stages[0]?.id || "", lead_id: "", deal_value: "" })}>
                 <Plus className="h-4 w-4" /> NOVO NEGÓCIO
               </Button>
             </div>
           </div>
 
           {loading ? (
             <div className="flex-1 grid place-items-center">
               <div className="flex flex-col items-center gap-4">
                 <div className="relative">
                   <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                   <div className="absolute inset-0 grid place-items-center">
                     <TrendingUp className="h-5 w-5 text-primary/50" />
                   </div>
                 </div>
                 <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Carregando Funil...</p>
               </div>
             </div>
           ) : (
             <div className="flex-1 overflow-x-auto p-6 scrollbar-thin">
               <div className="flex gap-6 h-full min-w-max">
                 {stages.map((stage) => (
                   <StageColumn
                     key={stage.id}
                     stage={stage}
                     deals={filteredDeals.filter((d) => d.stage_id === stage.id)}
                     onAddDeal={(stageId) => setAdding({ stage_id: stageId, lead_id: "", deal_value: "" })}
                     onRemoveDeal={removeDeal}
                     onMoveDeal={moveDeal}
                     dragId={dragId}
                     setDragId={setDragId}
                   />
                 ))}
                 
                 {/* Coluna de "Adicionar Etapa" (Placeholder visual por enquanto) */}
                 <div className="w-[300px] shrink-0 h-full rounded-2xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-4 opacity-40 hover:opacity-100 transition-all group cursor-pointer bg-muted/5">
                   <div className="h-12 w-12 rounded-full bg-muted grid place-items-center group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                     <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                   </div>
                   <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Nova Etapa</span>
                 </div>
               </div>
             </div>
           )}
         </main>
      </div>

      <Dialog open={!!adding} onOpenChange={(o) => !o && setAdding(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova negociação</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Lead</Label>
              <Select value={adding?.lead_id ?? ""} onValueChange={(v) => setAdding((p) => p ? { ...p, lead_id: v } : p)}>
                <SelectTrigger><SelectValue placeholder="Selecione um lead" /></SelectTrigger>
                <SelectContent>
                  {leads.length === 0 ? (
                    <div className="px-2 py-3 text-xs text-muted-foreground">Cadastre leads primeiro.</div>
                  ) : leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor (R$)</Label>
              <Input type="number" min={0} value={adding?.deal_value ?? ""} onChange={(e) => setAdding((p) => p ? { ...p, deal_value: e.target.value } : p)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdding(null)}>Cancelar</Button>
            <Button onClick={addDeal}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
