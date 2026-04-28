import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { evolution } from "@/lib/evolution";
import {
  MessageSquare,
  Loader2,
  User,
  Bot,
  Send,
  Search,
  Mic,
  Square,
  Smile,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  Image as ImageIcon,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export const Route = createFileRoute("/crm_/conversas")({
  head: () => ({
    meta: [
      { title: "Conversas WhatsApp — CRM" },
      { name: "description", content: "Atenda clientes do WhatsApp direto pelo CRM: texto, áudio e figurinhas." },
    ],
  }),
  component: ConversasPage,
});

type Msg = {
  role: "user" | "assistant" | "agent";
  content: string;
  at?: string;
  sent?: boolean;
  kind?: "text" | "audio" | "sticker" | "image";
  media?: string; // url ou data url para preview local
};
type Conversation = {
  id: string;
  contact_name: string | null;
  contact_phone: string;
  status: string;
  messages_count: number;
  last_message_at: string;
  transcript: Msg[];
};

type EvolutionChat = {
  id?: string;
  remoteJid?: string;
  name?: string;
  pushName?: string;
  profileName?: string;
  updatedAt?: string;
  lastMessageTime?: number | string;
  conversationTimestamp?: number | string;
  lastMessage?: any;
};

const STICKERS = [
  "👍", "❤️", "🔥", "👏", "🙏", "😂", "😍", "😎", "🥳", "🤝",
  "✅", "🚀", "💯", "🎉", "👌", "💪", "🤔", "😢", "😡", "🙌",
];

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const nested = [
      obj.data,
      obj.chats,
      obj.records,
      obj.result,
      obj.messages,
      (obj.messages as Record<string, unknown> | undefined)?.records,
    ].find(Array.isArray);
    if (Array.isArray(nested)) return nested as T[];
  }
  return [];
};

const getContactPhone = (value: any) => {
  const raw =
    value?.lastMessage?.key?.remoteJidAlt ??
    value?.lastMessage?.key?.remoteJid ??
    value?.key?.remoteJidAlt ??
    value?.key?.remoteJid ??
    value?.remoteJid ??
    "";

  return String(raw).split("@")[0].replace(/\D/g, "");
};

const getMessageText = (m: any) =>
  m?.message?.conversation ??
  m?.message?.extendedTextMessage?.text ??
  m?.message?.imageMessage?.caption ??
  m?.message?.videoMessage?.caption ??
  m?.text ??
  m?.body ??
  "";

const detectKind = (m: any): Msg["kind"] => {
  if (m?.message?.audioMessage || m?.messageType === "audioMessage") return "audio";
  if (m?.message?.stickerMessage || m?.messageType === "stickerMessage") return "sticker";
  if (m?.message?.imageMessage || m?.messageType === "imageMessage") return "image";
  return "text";
};

const normTs = (v: unknown) => {
  if (typeof v === "number") return new Date(v > 1e12 ? v : v * 1000).toISOString();
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    if (!Number.isNaN(n)) return new Date(n > 1e12 ? n : n * 1000).toISOString();
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
};

const normalizeTranscript = (messages: any[]): Msg[] =>
  messages
    .map((m) => {
      const kind = detectKind(m);
      const text = String(getMessageText(m) ?? "").trim();
      const fromMe = !!(m?.key?.fromMe ?? m?.fromMe);
      const placeholder =
        kind === "audio" ? "🎤 Áudio" : kind === "sticker" ? "🟦 Figurinha" : kind === "image" ? "🖼️ Imagem" : "";
      const content = text || placeholder;
      if (!content) return null;
      return {
        role: fromMe ? "assistant" : "user",
        kind,
        content,
        at: normTs(m?.messageTimestamp ?? m?.timestamp ?? m?.createdAt),
        sent: fromMe ? m?.status !== "ERROR" : undefined,
      } as Msg;
    })
    .filter(Boolean) as Msg[];

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => {
      const s = String(r.result ?? "");
      const idx = s.indexOf(",");
      resolve(idx >= 0 ? s.slice(idx + 1) : s);
    };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

function ConversasPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [resolvedInstance, setResolvedInstance] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [stickerOpen, setStickerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "bot" | "manual" | "unread">("all");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const syncLockRef = useRef(false);
  const readyForNotificationsRef = useRef(false);
  const lastIncomingMessageRef = useRef(new Map<string, string>());
  const [readState, setReadState] = useState<Record<string, number>>({});

  const unreadCount = (c: Conversation) => {
    const seen = readState[c.id] ?? 0;
    const incoming = (c.transcript ?? []).filter((m) => m.role === "user").length;
    return Math.max(0, incoming - seen);
  };

  const markAsRead = (c: Conversation | null) => {
    if (!c) return;
    const incoming = (c.transcript ?? []).filter((m) => m.role === "user").length;
    setReadState((prev) => (prev[c.id] === incoming ? prev : { ...prev, [c.id]: incoming }));
  };

  const getLastIncomingKey = (conversation: Conversation) => {
    const lastIncoming = [...(conversation.transcript ?? [])]
      .reverse()
      .find((message) => message.role === "user");

    if (!lastIncoming) return null;

    return [conversation.contact_phone, lastIncoming.at ?? "", lastIncoming.kind ?? "text", lastIncoming.content]
      .join("|")
      .trim();
  };

  const rememberConversation = (conversation: Conversation) => {
    const key = getLastIncomingKey(conversation);
    if (key) lastIncomingMessageRef.current.set(conversation.contact_phone, key);
  };

  const maybeNotifyIncoming = (conversation: Conversation) => {
    const key = getLastIncomingKey(conversation);
    if (!key) return;

    const previousKey = lastIncomingMessageRef.current.get(conversation.contact_phone);
    lastIncomingMessageRef.current.set(conversation.contact_phone, key);

    if (!readyForNotificationsRef.current || previousKey === key) return;

    const title = conversation.contact_name ?? conversation.contact_phone;
    const lastIncoming = [...(conversation.transcript ?? [])]
      .reverse()
      .find((message) => message.role === "user");
    const description = lastIncoming?.content || "Nova mensagem recebida";

    toast.info(`Nova mensagem de ${title}`, { description });

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted" &&
      document.visibilityState !== "visible"
    ) {
      new Notification(title, { body: description });
    }
  };

  const applyConversations = (list: Conversation[], notify = false) => {
    const dedupMap = new Map<string, Conversation>();
    for (const conversation of list) {
      const key = conversation.contact_phone;
      const previous = dedupMap.get(key);
      if (!previous) {
        dedupMap.set(key, conversation);
        continue;
      }
      const previousAt = +new Date(previous.last_message_at);
      const currentAt = +new Date(conversation.last_message_at);
      const previousLen = previous.transcript?.length ?? 0;
      const currentLen = conversation.transcript?.length ?? 0;
      if (currentAt > previousAt || (currentAt === previousAt && currentLen > previousLen)) {
        dedupMap.set(key, conversation);
      }
    }
    const sorted = [...dedupMap.values()].sort(
      (a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at)
    );

    (notify ? sorted.forEach(maybeNotifyIncoming) : sorted.forEach(rememberConversation));

    setItems(sorted);
    setSelectedId((current) => {
      if (current && sorted.some((conversation) => conversation.id === current)) return current;
      return sorted[0]?.id ?? null;
    });
  };

  const resolveInstance = async () => {
    if (!user?.id) {
      const remoteInstances = await evolution.getInstances();
      const statusPriority = ["open", "connected", "active", "online", "connecting"];
      const remoteCandidate =
        remoteInstances.find((instance) => statusPriority.includes(String(instance.status ?? "").toLowerCase()))?.instanceName ??
        remoteInstances[0]?.instanceName ??
        null;

      setResolvedInstance(remoteCandidate);
      return remoteCandidate;
    }

    const [{ data: settings, error: settingsError }, { data: savedInstances, error: instancesError }] = await Promise.all([
      supabase.from("bot_settings").select("whatsapp_instance").eq("user_id", user.id).maybeSingle(),
      supabase
        .from("whatsapp_instances")
        .select("instance_name, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (settingsError) throw settingsError;
    if (instancesError) throw instancesError;

    const configured = settings?.whatsapp_instance?.trim();
    if (configured) {
      setResolvedInstance(configured);
      return configured;
    }

    const statusPriority = ["open", "connected", "active", "online", "connecting"];
    const dbCandidate = (savedInstances ?? []).find((instance) =>
      statusPriority.includes(String(instance.status ?? "").toLowerCase())
    )?.instance_name;

    if (dbCandidate) {
      setResolvedInstance(dbCandidate);
      return dbCandidate;
    }

    const remoteInstances = await evolution.getInstances();
    const remoteCandidate =
      remoteInstances.find((instance) => statusPriority.includes(String(instance.status ?? "").toLowerCase()))?.instanceName ??
      remoteInstances[0]?.instanceName ??
      null;

    if (remoteCandidate) {
      setResolvedInstance(remoteCandidate);
      await supabase.from("bot_settings").upsert(
        { user_id: user.id, whatsapp_instance: remoteCandidate },
        { onConflict: "user_id" }
      );
    }

    return remoteCandidate;
  };

  const load = async () => {
    if (!user?.id) {
      setLoading(false);
      setLoadError(null);
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from("bot_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      applyConversations((data ?? []) as any as Conversation[]);
    } catch (error: any) {
      console.error("Erro ao carregar conversas", error);
      setLoadError(error?.message ?? "Não foi possível carregar as conversas.");
      setItems([]);
      setSelectedId(null);
      toast.error(error?.message ?? "Não foi possível carregar as conversas.");
    } finally {
      setLoading(false);
    }
  };

  const syncFromWhatsApp = async (showToast = false) => {
    if (syncLockRef.current) return;
    syncLockRef.current = true;
    setSyncing(true);
    try {
      const instance = await resolveInstance();
      let existing: Conversation[] = [];

      if (user?.id) {
        const { data: existingRows, error: existingError } = await supabase
          .from("bot_conversations")
          .select("*")
          .eq("user_id", user.id);

        if (existingError) throw existingError;
        existing = (existingRows ?? []) as any as Conversation[];
      }

      if (!instance) {
        if (showToast) toast.error("Conecte ou selecione sua instância do WhatsApp primeiro.");
        return;
      }

      const rawChats = await evolution.findChats(instance);
      const chats = asArray<EvolutionChat>(rawChats).filter(
        (c) => !!c?.remoteJid && !String(c.remoteJid).endsWith("@g.us")
      );
      if (chats.length === 0) {
        if (showToast) toast.info("Nenhuma conversa na instância.");
        return;
      }
      const byPhone = new Map(
        existing.map((c) => [c.contact_phone, c])
      );
      const previewRows = chats
        .map((chat) => {
          const phone = getContactPhone(chat);
          if (!phone) return null;

          const existingConversation = byPhone.get(phone);
          const previewTranscript = existingConversation?.transcript?.length
            ? existingConversation.transcript
            : normalizeTranscript(chat.lastMessage ? [chat.lastMessage] : []);

          return {
            id: existingConversation?.id ?? `${instance}:${phone}`,
            contact_phone: phone,
            contact_name:
              chat.name ??
              chat.pushName ??
              chat.profileName ??
              chat.lastMessage?.pushName ??
              existingConversation?.contact_name ??
              null,
            transcript: previewTranscript,
            status: existingConversation?.status ?? "active",
            messages_count: previewTranscript.length,
            last_message_at:
              previewTranscript[previewTranscript.length - 1]?.at ??
              normTs(chat.updatedAt ?? chat.lastMessageTime ?? chat.conversationTimestamp ?? chat.lastMessage?.messageTimestamp),
          } satisfies Conversation;
        })
        .filter((row): row is Conversation => !!row);

      if (previewRows.length > 0) {
        applyConversations(previewRows, lastIncomingMessageRef.current.size > 0);
        setLoading(false);
      }

      const rows = await Promise.all(
        chats.slice(0, 30).map(async (chat) => {
          const phone = getContactPhone(chat);
          if (!phone) return null;

          const ex = byPhone.get(phone);
          const raw = await evolution.findMessages(instance, chat.remoteJid!);
          const transcript = normalizeTranscript(asArray<any>(raw));
          const fallbackTranscript = normalizeTranscript(chat.lastMessage ? [chat.lastMessage] : []);
          const mergedTranscript = transcript.length > 0 ? transcript : ex?.transcript ?? fallbackTranscript;
          const lastAt =
            mergedTranscript[mergedTranscript.length - 1]?.at ??
            normTs(chat.updatedAt ?? chat.lastMessageTime ?? chat.conversationTimestamp ?? chat.lastMessage?.messageTimestamp);

          return {
            id: ex?.id ?? `${instance}:${phone}`,
            contact_phone: phone,
            contact_name:
              chat.name ??
              chat.pushName ??
              chat.profileName ??
              chat.lastMessage?.pushName ??
              ex?.contact_name ??
              null,
            transcript: mergedTranscript,
            status: ex?.status ?? "active",
            messages_count: mergedTranscript.length,
            last_message_at: lastAt,
          } satisfies Conversation;
        })
      );
      const valid = rows.filter((row): row is Conversation => !!row && row.transcript.length > 0);
      if (user?.id && valid.length > 0) {
        const upsertRows = valid.map((row) => ({
          ...(row.id.includes(":") ? {} : { id: row.id }),
          user_id: user.id,
          contact_phone: row.contact_phone,
          contact_name: row.contact_name,
          transcript: row.transcript as any,
          status: row.status,
          messages_count: row.messages_count,
          last_message_at: row.last_message_at,
        }));

        const { error: upsertError } = await supabase
          .from("bot_conversations")
          .upsert(upsertRows, { onConflict: "user_id,contact_phone" });
        if (upsertError) throw upsertError;
      }

      if (user?.id) {
        await load();
      } else {
        applyConversations(valid, lastIncomingMessageRef.current.size > 0);
        setLoading(false);
      }

      if (showToast) toast.success("Conversas sincronizadas.");
    } catch (e: any) {
      console.error("Falha ao sincronizar WhatsApp", e);
      toast.error(e?.message ?? "Falha ao sincronizar.");
    } finally {
      setSyncing(false);
      syncLockRef.current = false;
    }
  };

  useEffect(() => {
    load();
    const ch = user?.id
      ? supabase
          .channel("conv:bot_conversations:" + user.id)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "bot_conversations", filter: `user_id=eq.${user.id}` },
            (payload) => {
              if (payload.eventType === "DELETE") {
                setItems((prev) => prev.filter((c) => c.id !== (payload.old as any).id));
                return;
              }

              const row = payload.new as any as Conversation;
              setItems((prev) => {
                const next = [row, ...prev.filter((c) => c.id !== row.id)];
                next.sort((a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at));
                return next;
              });

              maybeNotifyIncoming(row);
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") readyForNotificationsRef.current = true;
          })
      : null;

    const initialTimer = window.setTimeout(() => {
      syncFromWhatsApp(false);
    }, 300);

    const poller = window.setInterval(() => {
      syncFromWhatsApp(false);
    }, 15000);

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined);
    }

    return () => {
      clearTimeout(initialTimer);
      clearInterval(poller);
      readyForNotificationsRef.current = false;
      if (ch) supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const filtered = useMemo(
    () =>
      items.filter((c) => {
        const matchSearch =
          !search ||
          (c.contact_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
          c.contact_phone.includes(search);
        if (!matchSearch) return false;
        if (statusFilter === "bot") return c.status !== "handed_off";
        if (statusFilter === "manual") return c.status === "handed_off";
        if (statusFilter === "unread") return unreadCount(c) > 0;
        return true;
      }),
    [items, search, statusFilter, readState]
  );

  const selected = useMemo(
    () => items.find((c) => c.id === selectedId) ?? null,
    [items, selectedId]
  );

  useEffect(() => {
    // Mensagens mais recentes ficam no topo — rolar para o início ao abrir/atualizar
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected?.transcript?.length, selectedId]);

  // Mark conversation as read when opened or when new messages arrive while open
  useEffect(() => {
    if (selected) markAsRead(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selected?.transcript?.length]);

  const totalUnread = useMemo(
    () => items.reduce((acc, c) => acc + unreadCount(c), 0),
    [items, readState]
  );

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso);
    if (isToday(d)) return "Hoje";
    if (isYesterday(d)) return "Ontem";
    if (isThisWeek(d, { locale: ptBR })) return format(d, "EEEE", { locale: ptBR });
    return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const sendPayload = async (payload: Record<string, unknown>) => {
    if (!selected) return;
    setSending(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }
      const { data, error } = await supabase.functions.invoke("send-whatsapp", {
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          phone: selected.contact_phone,
          contactName: selected.contact_name,
          ...payload,
        },
      });
      if (error) throw error;
      if (data?.error) toast.error("Falha Evolution: " + data.error);
      else if (!data?.ok) toast.warning("Registrada, mas envio pode ter falhado.");
      else toast.success("Enviada!");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao enviar");
    } finally {
      setSending(false);
    }
  };

  const sendText = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    await sendPayload({ kind: "text", text: t });
  };

  const sendSticker = async (emoji: string) => {
    setStickerOpen(false);
    // Envia como texto (emoji grande). Evolution sendSticker requer .webp;
    // como atalho usamos texto — visualmente vira figurinha no chat do cliente.
    await sendPayload({ kind: "text", text: emoji });
  };

  const sendImageFile = async (file: File) => {
    const b64 = await blobToBase64(file);
    await sendPayload({
      kind: "image",
      media: b64,
      mimetype: file.type || "image/png",
      fileName: file.name,
      text: text.trim() || undefined,
    });
    setText("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const b64 = await blobToBase64(blob);
        await sendPayload({ kind: "audio", media: b64, mimetype: "audio/webm" });
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      setRecordSecs(0);
      recordTimerRef.current = window.setInterval(() => setRecordSecs((s) => s + 1), 1000);
    } catch {
      toast.error("Não foi possível acessar o microfone.");
    }
  };

  const stopRecording = (cancel = false) => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setRecording(false);
    setRecordSecs(0);
    const rec = recorderRef.current;
    if (!rec) return;
    if (cancel) {
      rec.ondataavailable = null;
      rec.onstop = () => rec.stream.getTracks().forEach((t) => t.stop());
    }
    if (rec.state !== "inactive") rec.stop();
    recorderRef.current = null;
  };

  const toggleHandoff = async () => {
    if (!selected) return;
    const ns = selected.status === "handed_off" ? "active" : "handed_off";
    const { error } = await supabase.from("bot_conversations").update({ status: ns }).eq("id", selected.id);
    if (error) toast.error(error.message);
    else toast.success(ns === "handed_off" ? "Bot pausado nesta conversa" : "Bot reativado");
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Conversas" subtitle="Atenda WhatsApp em tempo real" />
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar conversas */}
          <div className="w-[340px] border-r border-border flex flex-col bg-card/40">
            <div className="p-3 border-b border-border space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">Inbox</h3>
                  {totalUnread > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                      {totalUnread}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {items.length} conversa{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar contato..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <div className="flex items-center gap-1">
                {[
                  { id: "all", label: "Todas" },
                  { id: "unread", label: "Não lidas" },
                  { id: "bot", label: "Bot" },
                  { id: "manual", label: "Manual" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id as typeof statusFilter)}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition ${
                      statusFilter === f.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => syncFromWhatsApp(true)}
                className="w-full py-1.5 text-[11px] font-bold rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Sincronizando..." : "Atualizar"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="h-full grid place-items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : loadError ? (
                <div className="p-6 text-center text-xs text-muted-foreground space-y-3">
                  <MessageSquare className="h-8 w-8 mx-auto opacity-50" />
                  <div>{loadError}</div>
                  <button
                    onClick={() => {
                      load();
                      syncFromWhatsApp(false);
                    }}
                    className="mx-auto h-8 px-3 rounded-lg bg-muted hover:bg-muted/80 transition text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3 w-3" /> Tentar novamente
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  {resolvedInstance
                    ? "Nenhuma conversa encontrada ainda. Vamos continuar sincronizando automaticamente."
                    : "Nenhuma conversa ainda. Conecte a instância do WhatsApp para puxar o histórico."}
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
                  const unread = unreadCount(c);
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
                          <span className={`text-sm truncate ${unread > 0 ? "font-bold" : "font-semibold"}`}>
                            {c.contact_name ?? c.contact_phone}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(c.last_message_at), { addSuffix: false, locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className={`text-xs truncate ${unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {last?.role === "assistant" || last?.role === "agent" ? "Você: " : ""}
                            {last?.content ?? "—"}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            {unread > 0 && (
                              <span className="text-[10px] min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full font-bold bg-primary text-primary-foreground">
                                {unread > 99 ? "99+" : unread}
                              </span>
                            )}
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                c.status === "handed_off" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                              }`}
                            >
                              {c.status === "handed_off" ? "MANUAL" : "BOT"}
                            </span>
                          </div>
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
                    <h2 className="font-bold text-sm truncate">{selected.contact_name ?? selected.contact_phone}</h2>
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
                    <><PlayCircle className="h-4 w-4 text-success" /> Reativar bot</>
                  ) : (
                    <><PauseCircle className="h-4 w-4 text-warning" /> Pausar bot</>
                  )}
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-3">
                {(selected.transcript ?? []).length === 0 ? (
                  <div className="text-xs text-center text-muted-foreground py-10">Sem mensagens registradas.</div>
                ) : (
                  [...selected.transcript].reverse().map((m, i, arr) => {
                    const isUser = m.role === "user";
                    // Lista invertida: a "anterior" cronologicamente é a próxima do array
                    const older = arr[i + 1];
                    const showDate =
                      !older ||
                      (m.at && older.at && new Date(m.at).toDateString() !== new Date(older.at).toDateString());
                    return (
                      <div key={i}>
                        {showDate && m.at && (
                          <div className="flex justify-center my-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-muted text-muted-foreground">
                              {formatDateLabel(m.at)}
                            </span>
                          </div>
                        )}
                        <div className={`flex gap-2 ${isUser ? "justify-start" : "justify-end"}`}>
                        {isUser && (
                          <div className="h-7 w-7 rounded-full bg-muted grid place-items-center shrink-0">
                            <User className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                            isUser
                              ? "bg-muted rounded-bl-sm"
                              : "bg-primary text-primary-foreground rounded-br-sm"
                          } ${m.kind === "sticker" ? "text-3xl bg-transparent shadow-none !px-1 !py-0" : ""}`}
                        >
                          {m.kind === "audio" ? (
                            <span className="flex items-center gap-2">
                              <Mic className="h-4 w-4" /> Áudio
                            </span>
                          ) : m.kind === "image" ? (
                            <span className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" /> {m.content || "Imagem"}
                            </span>
                          ) : (
                            <span className="whitespace-pre-wrap break-words">{m.content}</span>
                          )}
                          {m.at && m.kind !== "sticker" && (
                            <div className={`text-[9px] mt-1 opacity-70 ${isUser ? "text-muted-foreground" : "text-primary-foreground"}`}>
                              {format(new Date(m.at), "HH:mm")}
                            </div>
                          )}
                        </div>
                        {!isUser && (
                          <div className="h-7 w-7 rounded-full bg-primary/15 text-primary grid place-items-center shrink-0">
                            <Bot className="h-3.5 w-3.5" />
                          </div>
                        )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-border bg-card p-3">
                {recording ? (
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-mono">
                      {String(Math.floor(recordSecs / 60)).padStart(2, "0")}:
                      {String(recordSecs % 60).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-muted-foreground flex-1">Gravando áudio...</span>
                    <button
                      onClick={() => stopRecording(true)}
                      className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition"
                      title="Cancelar"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                    <button
                      onClick={() => stopRecording(false)}
                      disabled={sending}
                      className="h-10 w-10 grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                      title="Enviar áudio"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative flex items-end gap-2">
                    {/* Stickers popover */}
                    {stickerOpen && (
                      <div className="absolute bottom-12 left-0 z-10 bg-popover border border-border rounded-2xl shadow-lg p-3 w-72">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-muted-foreground">Figurinhas</span>
                          <button onClick={() => setStickerOpen(false)} className="p-1 hover:bg-muted rounded">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {STICKERS.map((s) => (
                            <button
                              key={s}
                              onClick={() => sendSticker(s)}
                              className="text-2xl h-11 grid place-items-center rounded-lg hover:bg-muted transition"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setStickerOpen((v) => !v)}
                      className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition shrink-0"
                      title="Figurinhas"
                    >
                      <Smile className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition shrink-0"
                      title="Imagem"
                    >
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) sendImageFile(f);
                        e.target.value = "";
                      }}
                    />
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendText();
                        }
                      }}
                      rows={1}
                      placeholder="Digite uma mensagem..."
                      className="flex-1 resize-none bg-muted/50 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 max-h-28"
                    />
                    {text.trim() ? (
                      <button
                        onClick={sendText}
                        disabled={sending}
                        className="h-10 w-10 grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 shrink-0"
                        title="Enviar"
                      >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="h-10 w-10 grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition shrink-0"
                        title="Gravar áudio"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 grid place-items-center text-sm text-muted-foreground">
              Selecione uma conversa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}