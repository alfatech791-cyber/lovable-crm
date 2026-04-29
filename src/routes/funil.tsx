import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
 import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
 import { Loader2, Plus, Search, Filter, LayoutGrid, List, ArrowUpDown, TrendingUp, MessageSquare, X, Send, Bot, User, UserCog, PauseCircle, PlayCircle, RefreshCw } from "lucide-react";
 import { formatDistanceToNow } from "date-fns";
 import { ptBR } from "date-fns/locale";
 import { evolution } from "@/lib/evolution";
 type Msg = { role: "user" | "assistant" | "agent"; content: string; at?: string; sent?: boolean };
 type Conversation = {
   id: string;
   contact_name: string | null;
   contact_phone: string;
   status: string;
   messages_count: number;
   last_message_at: string;
   transcript: Msg[];
 };
 
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
type Deal = {
  id: string;
  lead_id: string;
  stage_id: string;
  deal_value: number;
  priority: string | null;
  last_message?: string;
  last_message_at?: string;
  lead?: {
    name: string;
    phone: string | null;
    source: string | null;
  }
};

 function FunnelPage() {
   const { user } = useAuth();
   const [viewMode, setViewMode] = useState<"kanban" | "chat">("kanban");
   const [stages, setStages] = useState<Stage[]>([]);
   const [deals, setDeals] = useState<Deal[]>([]);
   const [leads, setLeads] = useState<{ id: string; name: string }[]>([]);
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [loading, setLoading] = useState(true);
   const [dragId, setDragId] = useState<string | null>(null);
   const [adding, setAdding] = useState<{ stage_id: string; lead_id: string; deal_value: string } | null>(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
   const [chatOpen, setChatOpen] = useState(false);
   const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
   const [chatLoading, setChatLoading] = useState(false);
   const [messageText, setMessageText] = useState("");
   const [sending, setSending] = useState(false);
   const scrollRef = useRef<HTMLDivElement>(null);
   const loadConversation = async (phone: string) => {
     if (!user?.id || !phone) return;
     setChatLoading(true);
     try {
       const { data, error } = await supabase
         .from("bot_conversations")
         .select("*")
         .eq("user_id", user.id)
         .eq("contact_phone", phone)
         .maybeSingle();
 
       if (error) throw error;
       if (data) {
         setCurrentConversation(data as any as Conversation);
       } else {
         setCurrentConversation(null);
       }
     } catch (err) {
       console.error("Erro ao carregar conversa:", err);
       toast.error("Erro ao carregar conversa");
     } finally {
       setChatLoading(false);
     }
   };
 
   const sendMessage = async () => {
     if (!currentConversation || !messageText.trim() || sending) return;
     setSending(true);
     try {
       const { data, error } = await supabase.functions.invoke("send-whatsapp", {
         body: {
           phone: currentConversation.contact_phone,
           text: messageText.trim(),
           contactName: currentConversation.contact_name,
         },
       });
       if (error) throw error;
       setMessageText("");
       // O Realtime deve atualizar a conversa, mas vamos recarregar para garantir
       loadConversation(currentConversation.contact_phone);
     } catch (e: any) {
       toast.error(e?.message ?? "Erro ao enviar");
     } finally {
       setSending(false);
     }
   };
 
   const toggleHandoff = async () => {
     if (!currentConversation) return;
     const newStatus = currentConversation.status === "handed_off" ? "active" : "handed_off";
     const { error } = await supabase
       .from("bot_conversations")
       .update({ status: newStatus })
       .eq("id", currentConversation.id);
     
     if (error) toast.error(error.message);
     else {
       toast.success(newStatus === "handed_off" ? "Bot pausado" : "Bot reativado");
       loadConversation(currentConversation.contact_phone);
     }
   };
 
   useEffect(() => {
     if (chatOpen && currentConversation) {
       const timer = setTimeout(() => {
         scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
       }, 100);
       return () => clearTimeout(timer);
     }
   }, [chatOpen, currentConversation?.transcript?.length]);
 
   useEffect(() => {
     if (!user?.id || !chatOpen || !currentConversation) return;
     
     const ch = supabase
       .channel("funil_chat:" + currentConversation.contact_phone)
       .on(
         "postgres_changes",
         { 
           event: "UPDATE", 
           schema: "public", 
           table: "bot_conversations", 
           filter: `id=eq.${currentConversation.id}` 
         },
         (payload) => {
           setCurrentConversation(payload.new as any as Conversation);
         }
       )
       .subscribe();
       
     return () => { supabase.removeChannel(ch); };
   }, [user?.id, chatOpen, currentConversation?.id]);
 
   // Realtime para a lista de conversas
   useEffect(() => {
     if (!user?.id) return;
     
     const ch = supabase
       .channel("funil_conversations_list")
       .on(
         "postgres_changes",
         { 
           event: "*", 
           schema: "public", 
           table: "bot_conversations", 
           filter: `user_id=eq.${user.id}` 
         },
         () => {
           // Recarrega a lista quando houver qualquer mudança (nova mensagem, novo contato, etc)
           supabase.from("bot_conversations")
             .select("*")
             .eq("user_id", user.id)
             .order("last_message_at", { ascending: false })
             .then(({ data }) => {
               if (data) setConversations(data as any as Conversation[]);
             });
         }
       )
       .subscribe();
       
     return () => { supabase.removeChannel(ch); };
   }, [user?.id]);
 
    const filteredDeals = deals.filter(d => {
      const leadName = d.lead?.name?.toLowerCase() || "";
      const leadPhone = d.lead?.phone || "";
      const search = searchTerm.toLowerCase();
      return leadName.includes(search) || leadPhone.includes(searchTerm);
    });
 
   const totalPipeline = deals.reduce((sum, d) => sum + Number(d.deal_value ?? 0), 0);

  const load = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Garante estágios padrão
      await supabase.rpc("ensure_default_funnel_stages", { _user_id: user.id });
      
      const [stRes, dlRes, ldRes, convRes, allDealsRes] = await Promise.all([
        supabase.from("funnel_stages").select("*").or(`user_id.eq.${user.id},user_id.is.null`).order("order_index"),
        supabase.from("pipeline_leads").select("*, lead:leads(name, phone, source)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("leads").select("id, name, phone").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("bot_conversations").select("*").eq("user_id", user.id).order("last_message_at", { ascending: false }),
        supabase.from("pipeline_leads").select("lead_id")
      ]);
      
      if (stRes.error) toast.error("Erro ao carregar estágios: " + stRes.error.message);
      if (dlRes.error) toast.error("Erro ao carregar negociações: " + dlRes.error.message);
      if (ldRes.error) toast.error("Erro ao carregar leads: " + ldRes.error.message);
      if (convRes.error) toast.error("Erro ao carregar conversas: " + convRes.error.message);

      setStages((stRes.data as Stage[]) ?? []);
      const convs = (convRes.data as any as Conversation[]) ?? [];
      setConversations(convs);
      
      const existingLeadIds = new Set((allDealsRes.data as any[])?.map(d => d.lead_id) || []);
      
      const leadIds = (dlRes.data as any[])?.map(d => d.lead_id) || [];
      let lastMessagesMap: Record<string, { content: string, created_at: string }> = {};
      
      if (leadIds.length > 0) {
        const filteredLeadIds = leadIds.filter(Boolean);
        if (filteredLeadIds.length > 0) {
          const { data: msgData } = await supabase.from("messages").select("lead_id, content, created_at").in("lead_id", filteredLeadIds).order("created_at", { ascending: false });
          if (msgData) msgData.forEach(msg => { 
            if (msg.lead_id && !lastMessagesMap[msg.lead_id]) {
              lastMessagesMap[msg.lead_id] = { content: msg.content, created_at: msg.created_at }; 
            }
          });
        }
      }
      
      const dealsWithLastMessage = (dlRes.data as any[])?.map(deal => ({
        ...deal,
        last_message: deal.lead_id ? lastMessagesMap[deal.lead_id]?.content : undefined,
        last_message_at: deal.lead_id ? lastMessagesMap[deal.lead_id]?.created_at : undefined
      })) ?? [];
      
      setDeals(dealsWithLastMessage);
      const loadedLeads = (ldRes.data as any) ?? [];
      setLeads(loadedLeads);

      // Auto-create deals for conversations that don't have one yet
      if (stRes.data && stRes.data.length > 0) {
        const firstStageId = stRes.data[0].id;
        for (const conv of convs) {
          // Find lead for this conversation
          const lead = loadedLeads.find((l: any) => l.phone === conv.contact_phone);
          if (lead && !existingLeadIds.has(lead.id)) {
            try {
              await supabase.from("pipeline_leads").insert({
                user_id: user.id,
                lead_id: lead.id,
                stage_id: firstStageId,
                deal_value: 0
              });
              // Add to local state to avoid re-running or waiting for reload
              existingLeadIds.add(lead.id);
            } catch (e) {
              console.error("Error auto-creating deal for lead:", lead.id, e);
            }
          }
        }
        // If we added new deals, reload once to get the full objects with lead data
        if (convs.some(c => loadedLeads.find((l:any) => l.phone === c.contact_phone && !existingLeadIds.has(l.id)))) {
          load(); 
        }
      }
    } catch (err) {
      console.error("Erro no load:", err);
      toast.error("Erro ao carregar dados do funil");
    } finally {
      setLoading(false);
    }
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
     <div className="min-h-screen flex w-full bg-background overflow-hidden relative">
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
                {viewMode === "kanban" && (
                  <div className="flex bg-muted p-1 rounded-lg border border-border/50">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md bg-background shadow-sm text-primary">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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
                 <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                   {viewMode === "kanban" ? "Carregando Funil..." : "Carregando Conversas..."}
                 </p>
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
                     onSelectDeal={(deal) => {
                       if (deal.lead?.phone) {
                         setSelectedDealId(deal.id);
                         loadConversation(deal.lead.phone);
                         setChatOpen(true);
                       } else {
                         toast.error("Lead sem telefone para conversa");
                       }
                     }}
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
              </div>
            )}
          </main>
      </div>

      {/* Painel Lateral de Chat (Apenas no modo Kanban) */}
      {viewMode === "kanban" && chatOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-card border-l border-border shadow-2xl flex flex-col z-50">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-primary/10 grid place-items-center shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">
                  {currentConversation?.contact_name || currentConversation?.contact_phone || "Conversa"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {currentConversation?.contact_phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {currentConversation && (
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={toggleHandoff} title={currentConversation.status === "handed_off" ? "Reativar bot" : "Pausar bot"}>
                  {currentConversation.status === "handed_off" ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
            {chatLoading ? (
              <div className="grid place-items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !currentConversation ? (
              <div className="grid place-items-center h-full text-center text-xs text-muted-foreground px-6">
                Nenhuma conversa encontrada para este lead. Envie uma mensagem para iniciar.
              </div>
            ) : (
              currentConversation.transcript?.map((m, i) => {
                const mine = m.role === "agent" || m.sent;
                return (
                  <div key={i} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm", mine ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      {m.at && <p className="text-[9px] opacity-60 mt-1">{formatDistanceToNow(new Date(m.at), { addSuffix: true, locale: ptBR })}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-border bg-background flex items-center gap-2">
            <Input
              placeholder="Escreva uma mensagem..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              disabled={!currentConversation || sending}
              className="flex-1 h-9 text-sm"
            />
            <Button size="icon" className="h-9 w-9" onClick={sendMessage} disabled={!currentConversation || sending || !messageText.trim()}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

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
