import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Plus, Trash2 } from "lucide-react";
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

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    await supabase.rpc("ensure_default_funnel_stages", { _user_id: user.id });
    const [{ data: st }, { data: dl }, { data: ld }] = await Promise.all([
      supabase.from("funnel_stages").select("*").eq("user_id", user.id).order("order_index"),
      supabase.from("pipeline_leads").select("*, lead:leads(name, phone)").eq("user_id", user.id),
      supabase.from("leads").select("id, name").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setStages((st as Stage[]) ?? []);
    setDeals((dl as Deal[]) ?? []);
    setLeads((ld as any) ?? []);
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
        <main className="flex-1 overflow-hidden flex flex-col bg-muted/20">
          {loading ? (
            <div className="flex-1 grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="flex-1 overflow-x-auto p-6 flex gap-4">
              {stages.map((stage) => {
                const stageDeals = deals.filter((d) => d.stage_id === stage.id);
                const total = stageDeals.reduce((s, d) => s + Number(d.deal_value ?? 0), 0);
                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (dragId) moveDeal(dragId, stage.id); setDragId(null); }}
                    className="w-[280px] shrink-0 flex flex-col"
                  >
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color ?? "#888" }} />
                        <h3 className="text-[12px] font-bold uppercase tracking-wider flex-1 truncate">{stage.name}</h3>
                        <span className="text-[10px] font-bold text-muted-foreground">{stageDeals.length}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{fmt(total)}</div>
                    </div>
                    <div className="flex-1 space-y-2 min-h-[200px]">
                      <button
                        onClick={() => setAdding({ stage_id: stage.id, lead_id: "", deal_value: "" })}
                        className="w-full py-2 rounded-xl border border-dashed border-border text-[11px] text-muted-foreground hover:bg-muted/50 hover:text-primary transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Adicionar
                      </button>
                      {stageDeals.map((d) => (
                        <div
                          key={d.id}
                          draggable
                          onDragStart={() => setDragId(d.id)}
                          onDragEnd={() => setDragId(null)}
                          className="bg-card border border-border rounded-xl p-3 shadow-card hover:shadow-elegant hover:border-primary/30 transition cursor-grab active:cursor-grabbing group"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="text-[13px] font-bold truncate flex-1">{d.lead?.name ?? "Lead"}</div>
                            <button onClick={() => removeDeal(d.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{d.lead?.phone ?? "—"}</div>
                          <div className="mt-2 text-[11px] font-bold text-primary">{fmt(Number(d.deal_value ?? 0))}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
