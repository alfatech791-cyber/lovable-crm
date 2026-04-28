import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Loader2, User, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/crm_/conversas")({
  head: () => ({
    meta: [
      { title: "Conversas do Bot — CRM" },
      { name: "description", content: "Acompanhe os atendimentos automáticos do bot." },
    ],
  }),
  component: ConversasPage,
});

type Conversation = {
  id: string;
  contact_name: string | null;
  contact_phone: string;
  status: string;
  messages_count: number;
  last_message_at: string;
  transcript: { role: "user" | "assistant"; content: string; at?: string }[];
};

function ConversasPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase
        .from("bot_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("last_message_at", { ascending: false });
      const list = (data ?? []) as any as Conversation[];
      setItems(list);
      setSelected(list[0] ?? null);
      setLoading(false);
    })();
  }, [user?.id]);

  const filtered = items.filter((c) =>
    !search ||
    (c.contact_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    c.contact_phone.includes(search)
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Conversas do Bot" subtitle="Acompanhe atendimentos em tempo real" />
        <main className="flex-1 overflow-hidden p-6">
          {loading ? (
            <div className="h-full grid place-items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="h-full grid place-items-center text-center">
              <div>
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-display font-bold text-lg">Nenhuma conversa ainda</h3>
                <p className="text-sm text-muted-foreground">Quando o bot atender no WhatsApp, as conversas aparecerão aqui.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 h-full">
              {/* Lista */}
              <div className="bg-card border border-border rounded-2xl shadow-card flex flex-col overflow-hidden">
                <div className="p-3 border-b border-border">
                  <Input placeholder="Buscar contato..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`w-full text-left p-3 hover:bg-muted/50 transition ${selected?.id === c.id ? "bg-muted/70" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate">{c.contact_name ?? c.contact_phone}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{c.contact_phone}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                        <span>{c.messages_count} msgs</span>
                        <span>{formatDistanceToNow(new Date(c.last_message_at), { addSuffix: true, locale: ptBR })}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-card border border-border rounded-2xl shadow-card flex flex-col overflow-hidden">
                {selected ? (
                  <>
                    <div className="p-4 border-b border-border">
                      <div className="font-display font-bold">{selected.contact_name ?? selected.contact_phone}</div>
                      <div className="text-xs text-muted-foreground">{selected.contact_phone} · {selected.messages_count} mensagens</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {(selected.transcript ?? []).length === 0 ? (
                        <div className="text-xs text-center text-muted-foreground py-10">Sem mensagens registradas.</div>
                      ) : (
                        selected.transcript.map((m, i) => (
                          <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                            {m.role === "user" && (
                              <div className="h-7 w-7 rounded-full bg-muted grid place-items-center shrink-0">
                                <User className="h-3.5 w-3.5" />
                              </div>
                            )}
                            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-muted rounded-bl-sm" : "bg-primary text-primary-foreground rounded-br-sm"}`}>
                              {m.content}
                            </div>
                            {m.role === "assistant" && (
                              <div className="h-7 w-7 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                                <Bot className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 grid place-items-center text-sm text-muted-foreground">Selecione uma conversa</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}