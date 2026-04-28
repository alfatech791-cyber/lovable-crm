import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Loader2,
  User,
  Bot,
  UserCog,
  PauseCircle,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

export function UnifiedChat() {
  const { user } = useAuth();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "handed_off">("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("bot_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("last_message_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar conversas");
    }
    const list = (data ?? []) as any as Conversation[];
    setItems(list);
    setSelectedId((cur) => cur ?? list[0]?.id ?? null);
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.id) return;
    load();
    const ch = supabase
      .channel("uc:bot_conversations:" + user.id)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bot_conversations", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setItems((prev) => {
            if (payload.eventType === "DELETE") {
              return prev.filter((c) => c.id !== (payload.old as any).id);
            }
            const row = payload.new as any as Conversation;
            const next = [row, ...prev.filter((c) => c.id !== row.id)];
            next.sort((a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at));
            return next;
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const filtered = useMemo(
    () =>
      items.filter((c) => {
        if (filter !== "all" && c.status !== filter) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          (c.contact_name ?? "").toLowerCase().includes(q) ||
          c.contact_phone.includes(search)
        );
      }),
    [items, search, filter]
  );

  const selected = useMemo(
    () => items.find((c) => c.id === selectedId) ?? null,
    [items, selectedId]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [selected?.transcript?.length, selectedId]);

  const send = async () => {
    if (!selected || !text.trim() || sending) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-whatsapp", {
        body: {
          phone: selected.contact_phone,
          text: text.trim(),
          contactName: selected.contact_name,
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error("Mensagem registrada, mas Evolution falhou: " + data.error);
      } else if (!data?.ok) {
        toast.warning("Mensagem registrada, mas envio pode ter falhado.");
      } else {
        toast.success("Enviada!");
      }
      setText("");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao enviar");
    } finally {
      setSending(false);
    }
  };

  const toggleHandoff = async () => {
    if (!selected) return;
    const newStatus = selected.status === "handed_off" ? "active" : "handed_off";
    const { error } = await supabase
      .from("bot_conversations")
      .update({ status: newStatus })
      .eq("id", selected.id);
    if (error) toast.error(error.message);
    else toast.success(newStatus === "handed_off" ? "Bot pausado nesta conversa" : "Bot reativado");
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Atendimento" subtitle="Mensagens do WhatsApp em tempo real" />
        <div className="flex-1 flex overflow-hidden">
          {/* Lista */}
          <div className="w-[360px] border-r border-border flex flex-col bg-card/40">
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Buscar por nome ou número..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border-none text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "active", "handed_off"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {f === "all" ? "Todas" : f === "active" ? "Bot ativo" : "Manual"}
                  </button>
                ))}
              </div>
              <button
                onClick={load}
                className="w-full py-1.5 text-[11px] font-bold rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-3 w-3" /> Atualizar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="h-full grid place-items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Nenhuma conversa ainda. Quando chegar mensagem no WhatsApp, ela aparece aqui.
                </div>
              ) : (
                filtered.map((c) => {
                  const last = c.transcript?.[c.transcript.length - 1];
                  const initials = (c.contact_name ?? c.contact_phone)
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full flex items-start gap-3 p-3 border-b border-border/50 transition relative text-left ${
                        selectedId === c.id ? "bg-primary/5" : "hover:bg-muted/30"
                      }`}
                    >
                      {selectedId === c.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      )}
                      <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-white font-bold text-sm">
                        {initials || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm truncate">
                            {c.contact_name ?? c.contact_phone}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(c.last_message_at), {
                              addSuffix: false,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-xs text-muted-foreground truncate">
                            {last?.content ?? "—"}
                          </p>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                              c.status === "handed_off"
                                ? "bg-warning/15 text-warning"
                                : "bg-success/15 text-success"
                            }`}
                          >
                            {c.status === "handed_off" ? "MANUAL" : "BOT"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Área de chat */}
          {selected ? (
            <div className="flex-1 flex flex-col bg-card/20 min-w-0">
              <div className="h-[68px] px-6 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 grid place-items-center font-bold text-sm text-white shrink-0">
                    {(selected.contact_name ?? selected.contact_phone).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm truncate">
                      {selected.contact_name ?? selected.contact_phone}
                    </h2>
                    <p className="text-[10px] text-muted-foreground">
                      {selected.contact_phone} · {selected.messages_count} mensagens
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleHandoff}
                  className="h-9 px-3 rounded-lg bg-muted hover:bg-muted/70 transition text-xs font-bold flex items-center gap-1.5"
                >
                  {selected.status === "handed_off" ? (
                    <>
                      <PlayCircle className="h-4 w-4 text-success" /> Reativar bot
                    </>
                  ) : (
                    <>
                      <PauseCircle className="h-4 w-4 text-warning" /> Pausar bot
                    </>
                  )}
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-3">
                {(selected.transcript ?? []).length === 0 ? (
                  <div className="text-xs text-center text-muted-foreground py-10">
                    Sem mensagens registradas.
                  </div>
                ) : (
                  selected.transcript.map((m, i) => {
                    const isUser = m.role === "user";
                    const isBot = m.role === "assistant";
                    return (
                      <div
                        key={i}
                        className={`flex gap-2 ${isUser ? "justify-start" : "justify-end"}`}
                      >
                        {isUser && (
                          <div className="h-7 w-7 rounded-full bg-muted grid place-items-center shrink-0">
                            <User className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                            isUser
                              ? "bg-muted rounded-bl-sm"
                              : isBot
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-success text-white rounded-br-sm"
                          }`}
                        >
                          {m.content}
                          {m.at && (
                            <div className={`text-[9px] mt-1 opacity-70`}>
                              {new Date(m.at).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {!isUser && m.sent === false && " · falhou"}
                            </div>
                          )}
                        </div>
                        {isBot && (
                          <div className="h-7 w-7 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                            <Bot className="h-3.5 w-3.5" />
                          </div>
                        )}
                        {m.role === "agent" && (
                          <div className="h-7 w-7 rounded-full bg-success/15 text-success grid place-items-center shrink-0">
                            <UserCog className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 bg-card border-t border-border">
                <div className="flex items-end gap-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Digite sua mensagem... (Enter envia, Shift+Enter quebra linha)"
                    className="flex-1 bg-muted/50 rounded-2xl border border-border focus:border-primary/40 outline-none p-3 text-sm min-h-[48px] max-h-32 resize-none"
                    rows={1}
                  />
                  <button
                    onClick={send}
                    disabled={sending || !text.trim()}
                    className="h-12 w-12 shrink-0 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:opacity-90 transition disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid place-items-center bg-muted/10">
              <div className="text-center space-y-3 max-w-sm px-6">
                <div className="h-20 w-20 rounded-3xl bg-card border border-border shadow-card mx-auto grid place-items-center text-primary/40">
                  <MessageSquare className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold font-display">Selecione uma conversa</h3>
                <p className="text-sm text-muted-foreground">
                  As mensagens recebidas no WhatsApp aparecem aqui em tempo real.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}