import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
 import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
  import { Loader2, Plus, Search, Filter, LayoutGrid, List, ArrowUpDown, TrendingUp, MessageSquare, X, Send, Bot, User, UserCog, PauseCircle, PlayCircle, RefreshCw, ChevronRight, Sparkles, CreditCard, Users, Clock, Wifi } from "lucide-react";
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
  last_message_role?: "user" | "assistant" | "agent";
  lead?: {
    name: string;
    phone: string | null;
    source: string | null;
  }
};

  const normalizePhone = (p: string | null) => {
    if (!p) return "";
    // Remove tudo que não é dígito e remove o sufixo do whatsapp se existir
    return p.split("@")[0].replace(/\D/g, "");
  };
 
 function FunnelPage() {
    const { user, loading: authLoading } = useAuth();
    const [syncing, setSyncing] = useState(false);

    // Garante que o webhook está configurado para receber mensagens em tempo real
    const ensureWebhook = async (instance: string) => {
      if (!user?.id || !instance) return;
      try {
        const { data: settings } = await supabase
          .from("bot_settings")
          .select("webhook_secret")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!settings?.webhook_secret) return;

        const projectRef = window.location.hostname.split('.')[0];
        const expectedUrl = `https://${projectRef}.supabase.co/functions/v1/bot-webhook?uid=${user.id}&secret=${settings.webhook_secret}`;

        const current = await evolution.getWebhook(instance);
        const currentUrl = current?.url ?? current?.webhook?.url ?? "";
        if (currentUrl === expectedUrl) return;

        await evolution.setWebhook(instance, expectedUrl);
        console.log("Webhook sincronizado no Funil:", expectedUrl);
      } catch (e) {
        console.warn("Erro ao sincronizar webhook no Funil:", e);
      }
    };

    const syncFromWhatsApp = async () => {
      if (!user?.id || syncing) return;
      setSyncing(true);
      try {
        const instances = await evolution.getInstances();
        const instanceObj = instances.find(i => i.status === 'open' || (i as any).status === 'connected');
        const instance = instanceObj?.instanceName;
        
        if (!instance) {
          toast.error("Nenhuma instância do WhatsApp conectada");
          return;
        }

        await ensureWebhook(instance);

        const rawChats = await evolution.findChats(instance);
        const chats = Array.isArray(rawChats) ? rawChats : (rawChats?.records || rawChats?.chats || []);
        
        if (!Array.isArray(chats) || chats.length === 0) {
          toast.info("Nenhuma conversa encontrada na instância");
          return;
        }

        toast.info(`Sincronizando ${chats.length} conversas...`);

        for (const chat of chats.slice(0, 50)) {
          const remoteJid = chat.remoteJid || chat.id || "";
          if (!remoteJid || remoteJid.endsWith("@g.us")) continue;
          
          const phone = remoteJid.split("@")[0].replace(/\D/g, "");
          const name = chat.name || chat.pushName || chat.verifiedName || null;
          
          const lastMsg = chat.lastMessage;
          const transcript = lastMsg ? [{
            role: lastMsg.key?.fromMe ? "assistant" : "user",
            content: lastMsg.message?.conversation || lastMsg.message?.extendedTextMessage?.text || "Nova conversa",
            at: new Date(lastMsg.messageTimestamp ? lastMsg.messageTimestamp * 1000 : Date.now()).toISOString()
          }] : [];

          await supabase.from("bot_conversations").upsert({
            user_id: user.id,
            contact_phone: phone,
            contact_name: name,
            transcript,
            status: "active",
            messages_count: transcript.length,
            last_message_at: transcript[0]?.at || new Date().toISOString()
          }, { onConflict: "user_id,contact_phone" });
        }

        toast.success("Sincronização concluída");
        load();
      } catch (err: any) {
        console.error("Erro na sincronização:", err);
        toast.error("Erro ao sincronizar WhatsApp: " + err.message);
      } finally {
        setSyncing(false);
      }
    };

    const [viewMode, setViewMode] = useState<"kanban" | "chat">("kanban");
   const [stages, setStages] = useState<Stage[]>([]);
   const [deals, setDeals] = useState<Deal[]>([]);
   const [leads, setLeads] = useState<{ id: string; name: string }[]>([]);
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [loading, setLoading] = useState(true);
   const [dragId, setDragId] = useState<string | null>(null);
   const [adding, setAdding] = useState<{ stage_id: string; lead_id: string; deal_value: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"recent" | "value">("recent");
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
            // Recarrega a lista e o funil quando houver qualquer mudança
            load(true);
         }
       )
       .subscribe();
       
       return () => { supabase.removeChannel(ch); };
     }, [user?.id]);
 
     // Realtime para Mensagens Individuais
     useEffect(() => {
       if (!user?.id) return;
       
       const ch = supabase
         .channel("funil_messages_updates")
         .on(
           "postgres_changes",
           { 
             event: "INSERT", 
             schema: "public", 
             table: "messages", 
             filter: `user_id=eq.${user.id}` 
           },
           () => {
             load(true);
           }
         )
         .subscribe();
         
       return () => { supabase.removeChannel(ch); };
     }, [user?.id]);

    // Realtime para Negócios (Deals)
    useEffect(() => {
      if (!user?.id) return;
      
      const ch = supabase
        .channel("funil_pipeline_leads")
        .on(
          "postgres_changes",
          { 
            event: "*", 
            schema: "public", 
            table: "pipeline_leads", 
            filter: `user_id=eq.${user.id}` 
          },
          () => {
            load(); // Recarrega quando houver qualquer mudança no pipeline
          }
        )
        .subscribe();
        
      return () => { supabase.removeChannel(ch); };
    }, [user?.id]);

    const filteredDeals = deals
      .filter(d => {
        const leadName = d.lead?.name?.toLowerCase() || "";
        const leadPhone = d.lead?.phone || "";
        const search = searchTerm.toLowerCase();
        return leadName.includes(search) || leadPhone.includes(searchTerm);
      })
      .sort((a, b) => {
        if (sortBy === "value") return Number(b.deal_value || 0) - Number(a.deal_value || 0);
        // Default to recent (last message or creation date)
        const dateA = a.last_message_at || (a as any).created_at || "";
        const dateB = b.last_message_at || (b as any).created_at || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
 
   const totalPipeline = deals.reduce((sum, d) => sum + Number(d.deal_value ?? 0), 0);

   const load = async (silent = false) => {
     if (!user?.id) {
       if (!authLoading) setLoading(false);
       return;
     }
     
      try {
        if (!silent) setLoading(true);
        
        // Inicializa configurações do bot e estágios
        const { data: settings } = await supabase.from("bot_settings").select("id").eq("user_id", user.id).maybeSingle();
        if (!settings) {
          await supabase.from("bot_settings").insert({ user_id: user.id });
        }
        
        try {
          await supabase.rpc("ensure_default_funnel_stages", { _user_id: user.id });
        } catch (rpcErr) {
          console.warn("RPC ensure_default_funnel_stages falhou, continuando...", rpcErr);
        }

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
      let lastMessagesMap: Record<string, { content: string, created_at: string, role?: any }> = {};
      
      if (leadIds.length > 0) {
        const filteredLeadIds = leadIds.filter(Boolean);
        if (filteredLeadIds.length > 0) {
          const { data: msgData } = await supabase.from("messages").select("lead_id, content, created_at, direction").in("lead_id", filteredLeadIds).order("created_at", { ascending: false });
          if (msgData) msgData.forEach(msg => { 
            if (msg.lead_id && !lastMessagesMap[msg.lead_id]) {
              // Normalize role: inbound -> user, outbound -> agent
              lastMessagesMap[msg.lead_id] = { 
                content: msg.content, 
                created_at: msg.created_at, 
                role: (msg as any).direction === 'inbound' ? 'user' : 'agent' 
              }; 
            }
          });
        }
      }
      
        const dealsWithLastMessage = (dlRes.data as any[])?.map((deal: any) => {
          const dealPhone = normalizePhone(deal.lead?.phone);
          const conv = convs.find(c => normalizePhone(c.contact_phone) === dealPhone);
          let lastMessage = deal.lead_id ? lastMessagesMap[deal.lead_id]?.content : undefined;
          let lastMessageAt = deal.lead_id ? lastMessagesMap[deal.lead_id]?.created_at : undefined;
          let lastMessageRole = deal.lead_id ? lastMessagesMap[deal.lead_id]?.role : undefined;
 
         // Prioritize data from bot_conversations for WhatsApp leads
         if (conv) {
           const transcript = conv.transcript as Msg[];
           if (transcript && transcript.length > 0) {
              const last = transcript[transcript.length - 1];
              lastMessage = last.content;
             lastMessageAt = conv.last_message_at;
              lastMessageRole = last.role;
           }
         }
 
         return {
           ...deal,
           last_message: lastMessage,
            last_message_at: lastMessageAt,
            last_message_role: lastMessageRole
         };
       }) ?? [];
      
      setDeals(dealsWithLastMessage);
      const loadedLeads = (ldRes.data as any) ?? [];
      setLeads(loadedLeads);

       // A criação automática de leads e negócios agora é feita via gatilho no banco (handle_new_bot_conversation)
       // para garantir sincronização instantânea sem depender de lógica no frontend.
    } catch (err) {
      console.error("Erro no load:", err);
      toast.error("Erro ao carregar dados do funil");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => { 
      load(); 
      // Se não houver negociações, tenta um sync automático
      if (user?.id && !loading && deals.length === 0) {
        syncFromWhatsApp();
      }
    }, [user?.id, authLoading]);

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
         <Topbar title="Funil de Vendas" subtitle="Gerencie seus leads e converta mais vendas" />
          <main className="flex-1 overflow-hidden flex flex-col bg-muted/5">
            {/* Stats Summary Panel */}
            <div className="px-6 py-4 bg-background border-b border-border/40 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Total em Pipeline</p>
                  <p className="text-lg font-black text-primary leading-none">{fmt(totalPipeline)}</p>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-2xl p-3 border border-border/50 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-muted-foreground">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Total de Leads</p>
                  <p className="text-lg font-black text-foreground leading-none">{deals.length}</p>
                </div>
              </div>

              <div className="bg-amber-500/5 rounded-2xl p-3 border border-amber-500/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Aguardando Resposta</p>
                  <p className="text-lg font-black text-amber-600 leading-none">{deals.filter(d => d.last_message_at && (new Date().getTime() - new Date(d.last_message_at).getTime() > 24 * 60 * 60 * 1000)).length}</p>
                </div>
              </div>

              <div className="bg-green-500/5 rounded-2xl p-3 border border-green-500/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Taxa de Conversão</p>
                  <p className="text-lg font-black text-green-600 leading-none">12.5%</p>
                </div>
              </div>
            </div>

            {/* Toolbar Superior Melhorada */}
            <div className="px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Buscar lead ou telefone..." 
                    className="pl-9 w-72 bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 transition-all text-sm h-10 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/20">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={syncing}
                      className={cn("h-8 px-3 gap-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all", syncing ? "bg-primary/20 text-primary animate-pulse" : "hover:bg-primary/10 hover:text-primary")}
                      onClick={syncFromWhatsApp}
                    >
                      {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wifi className="h-3 w-3" />}
                      {syncing ? "Sincronizando..." : "Sincronizar WhatsApp"}
                    </Button>
                    <div className="w-[1px] h-4 bg-border/40 mx-1" />
                   <Button 
                    variant={sortBy === "recent" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="h-8 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg"
                    onClick={() => setSortBy("recent")}
                   >
                    Recentes
                   </Button>
                   <Button 
                    variant={sortBy === "value" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="h-8 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg"
                    onClick={() => setSortBy("value")}
                   >
                    Maior Valor
                   </Button>
                </div>
              </div>
  
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">IA Ativa</span>
                </div>
                
                 <div className="h-8 w-[1px] bg-border/40" />
                 
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                   onClick={() => load()}
                   disabled={loading}
                 >
                   <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                 </Button>
                
                <Button className="h-10 px-6 gap-2 text-xs font-black shadow-lg shadow-primary/20 rounded-xl hover:scale-105 transition-all" onClick={() => setAdding({ stage_id: stages[0]?.id || "", lead_id: "", deal_value: "" })}>
                  <Plus className="h-4 w-4" /> NOVO NEGÓCIO
                </Button>
              </div>
            </div>

            {/* Seletor de Visualização */}
            <div className="px-6 py-2 border-b border-border/40 bg-background/50 flex items-center gap-2">
              <Button 
                variant={viewMode === "kanban" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("kanban")}
                className={cn("gap-2 text-xs font-bold rounded-xl", viewMode === "kanban" && "bg-primary/10 text-primary hover:bg-primary/20")}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Kanban
              </Button>
              <Button 
                variant={viewMode === "chat" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("chat")}
                className={cn("gap-2 text-xs font-bold rounded-xl", viewMode === "chat" && "bg-primary/10 text-primary hover:bg-primary/20")}
              >
                <MessageSquare className="h-3.5 w-3.5" /> Conversas
              </Button>
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
            ) : viewMode === "kanban" ? (
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
                  
                   {/* Coluna de "Adicionar Etapa" Melhorada */}
                   <div className="w-[310px] shrink-0 h-[calc(100vh-280px)] rounded-2xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-4 opacity-40 hover:opacity-100 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer">
                     <div className="h-14 w-14 rounded-2xl bg-muted grid place-items-center group-hover:bg-primary/10 group-hover:scale-110 group-hover:rotate-90 transition-all">
                      <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Nova Etapa</span>
                  </div>
                </div>
              </div>
            ) : (
              /* View de Chat Integrada */
              <div className="flex-1 flex overflow-hidden bg-background">
                {/* Lista de Conversas */}
                <div className="w-80 border-r border-border flex flex-col bg-card/20">
                  <div className="p-4 border-b border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conversas</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => load()}
                      >
                        <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Filtrar conversas..." 
                        className="pl-9 h-9 text-xs bg-muted/50 border-none rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nenhuma conversa</p>
                      </div>
                    ) : (
                      conversations
                        .filter(c => 
                          (c.contact_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          c.contact_phone.includes(searchTerm)
                        )
                        .map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => {
                            setCurrentConversation(conv);
                            setChatOpen(true);
                          }}
                          className={cn(
                            "w-full p-4 flex items-start gap-3 border-b border-border/50 hover:bg-primary/5 transition-all text-left relative",
                            currentConversation?.id === conv.id && "bg-primary/5"
                          )}
                        >
                          {currentConversation?.id === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                          <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-xs font-black truncate text-foreground">{conv.contact_name || conv.contact_phone}</p>
                              <span className="text-[9px] font-bold text-muted-foreground shrink-0 uppercase">
                                {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false, locale: ptBR })}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate font-medium">
                              {conv.transcript?.[conv.transcript.length - 1]?.content || "Inicie uma conversa"}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Área de Chat Principal */}
                <div className="flex-1 flex flex-col bg-muted/5">
                  {currentConversation ? (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                      {/* Header do Chat na View Principal */}
                      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center border border-primary/20">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground">{currentConversation.contact_name || currentConversation.contact_phone}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">WhatsApp Ativo</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={toggleHandoff} className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase tracking-wider">
                          {currentConversation.status === "handed_off" ? "Reativar Bot" : "Pausar Bot"}
                        </Button>
                      </div>

                      {/* Mensagens */}
                      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                        {currentConversation.transcript?.map((m, i) => {
                          const mine = m.role === "agent" || m.sent;
                          return (
                            <div key={i} className={cn("flex flex-col max-w-[70%]", mine ? "ml-auto items-end" : "items-start")}>
                              <div className={cn(
                                "px-4 py-3 rounded-2xl text-sm shadow-sm",
                                mine ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border rounded-tl-none"
                              )}>
                                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                              </div>
                              {m.at && (
                                <span className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase">
                                  {formatDistanceToNow(new Date(m.at), { addSuffix: true, locale: ptBR })}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Input Principal */}
                      <div className="p-6 bg-background border-t border-border">
                        <div className="flex items-end gap-3 bg-muted/30 p-2 rounded-2xl border border-border/50">
                          <textarea
                            placeholder="Escreva sua mensagem..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none max-h-32"
                            rows={1}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                          />
                          <Button size="icon" className="h-11 w-11 rounded-xl shadow-lg shadow-primary/20" onClick={sendMessage} disabled={!messageText.trim() || sending}>
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 grid place-items-center opacity-50">
                      <div className="text-center">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Selecione uma conversa para começar</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
      </div>

       {/* Painel Lateral de Chat Refinado */}
       {viewMode === "kanban" && chatOpen && (
         <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-background border-l border-border shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col z-[100] animate-in slide-in-from-right duration-300">
           {/* Header do Chat */}
           <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10">
             <div className="flex items-center gap-4 min-w-0">
               <div className="relative">
                 <div className="h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center shrink-0 border border-primary/20">
                   <User className="h-5 w-5 text-primary" />
                 </div>
                 {currentConversation?.status !== "handed_off" && (
                   <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                     <Bot className="h-2 w-2 text-white" />
                   </div>
                 )}
               </div>
               <div className="min-w-0">
                 <p className="text-sm font-black truncate text-foreground tracking-tight">
                   {currentConversation?.contact_name || currentConversation?.contact_phone || "Lead Sem Nome"}
                 </p>
                 <div className="flex items-center gap-1.5">
                   <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                     Online via WhatsApp
                   </p>
                 </div>
               </div>
             </div>
             <div className="flex items-center gap-2">
               {currentConversation && (
                 <Button 
                  size="sm" 
                  variant="outline" 
                  className={cn("h-9 px-3 gap-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all", 
                    currentConversation.status === "handed_off" ? "border-amber-500/50 text-amber-600 bg-amber-500/5" : "border-primary/30 text-primary bg-primary/5")} 
                  onClick={toggleHandoff}
                 >
                   {currentConversation.status === "handed_off" ? (
                     <><PlayCircle className="h-3.5 w-3.5" /> Reativar Bot</>
                   ) : (
                     <><PauseCircle className="h-3.5 w-3.5" /> Pausar Bot</>
                   )}
                 </Button>
               )}
               <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-muted" onClick={() => setChatOpen(false)}>
                 <X className="h-5 w-5" />
               </Button>
             </div>
           </div>
 
           {/* Área de Mensagens */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-muted/5 scrollbar-thin">
             {chatLoading ? (
               <div className="grid place-items-center h-full">
                 <div className="flex flex-col items-center gap-3">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Carregando conversa...</span>
                 </div>
               </div>
             ) : !currentConversation ? (
               <div className="grid place-items-center h-full text-center px-10">
                 <div className="bg-muted/30 p-8 rounded-[40px] border-2 border-dashed border-border/50">
                   <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                   <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                     Nenhuma conversa encontrada. Inicie um atendimento agora mesmo enviando uma mensagem.
                   </p>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col gap-4">
                 {currentConversation.transcript?.map((m, i) => {
                   const mine = m.role === "agent" || m.sent;
                   const isBot = m.role === "assistant";
                   
                   return (
                     <div key={i} className={cn("flex flex-col max-w-[85%]", mine ? "ml-auto items-end" : "items-start")}>
                       <div className={cn(
                         "relative px-4 py-3 rounded-2xl text-sm shadow-sm transition-all hover:shadow-md",
                         mine ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border rounded-tl-none",
                         isBot && "border-primary/30 bg-primary/5 text-foreground"
                       )}>
                         {isBot && (
                           <div className="flex items-center gap-1 mb-1 opacity-60">
                             <Bot className="h-3 w-3" />
                             <span className="text-[9px] font-black uppercase">Auto-Atendimento</span>
                           </div>
                         )}
                         <p className="whitespace-pre-wrap break-words leading-relaxed font-medium">{m.content}</p>
                       </div>
                       {m.at && (
                         <span className="text-[9px] font-bold text-muted-foreground/50 mt-1.5 px-1 uppercase tracking-tighter">
                           {formatDistanceToNow(new Date(m.at), { addSuffix: true, locale: ptBR })}
                         </span>
                       )}
                     </div>
                   );
                 })}
               </div>
             )}
           </div>
 
           {/* Input de Mensagem */}
           <div className="p-6 border-t border-border bg-background shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
             <div className="relative flex items-end gap-3 bg-muted/30 p-2 rounded-2xl border border-border/50 focus-within:border-primary/30 transition-all">
               <textarea
                 placeholder="Digite sua mensagem aqui..."
                 value={messageText}
                 onChange={(e) => setMessageText(e.target.value)}
                 onKeyDown={(e) => { 
                   if (e.key === "Enter" && !e.shiftKey) { 
                     e.preventDefault(); 
                     sendMessage(); 
                   } 
                 }}
                 rows={1}
                 disabled={!currentConversation || sending}
                 className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none scrollbar-hide"
               />
               <Button 
                size="icon" 
                className="h-11 w-11 rounded-xl shrink-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" 
                onClick={sendMessage} 
                disabled={!currentConversation || sending || !messageText.trim()}
               >
                 {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
               </Button>
             </div>
             <div className="flex items-center justify-between mt-3 px-1">
               <p className="text-[10px] text-muted-foreground/60 font-medium">
                 Pressione <span className="font-bold">Enter</span> para enviar
               </p>
               <div className="flex gap-2">
                 <button className="text-[10px] font-black text-primary/70 uppercase tracking-widest hover:text-primary transition-colors">Templates</button>
                 <button className="text-[10px] font-black text-primary/70 uppercase tracking-widest hover:text-primary transition-colors">Anexar</button>
               </div>
             </div>
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
