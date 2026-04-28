// Webhook público da Evolution API. Recebe mensagens, consulta config do bot
// do usuário dono da instância e responde via Lovable AI.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("uid");
    const secret = url.searchParams.get("secret");
    if (!userId || !secret) return json({ error: "missing uid or secret" }, 400);

    const payload = await req.json().catch(() => ({}));
    const event = payload?.event ?? payload?.type;

    // Só reage a mensagens recebidas
    if (event !== "messages.upsert" && event !== "MESSAGES_UPSERT") {
      return json({ ok: true, ignored: event });
    }

    const data = payload?.data ?? payload;
    const fromMe = data?.key?.fromMe;
    const remoteJid: string = data?.key?.remoteJid ?? "";
    if (fromMe || !remoteJid || remoteJid.endsWith("@g.us")) {
      return json({ ok: true, skipped: true });
    }

    const messageText: string =
      data?.message?.conversation ??
      data?.message?.extendedTextMessage?.text ??
      "";
    if (!messageText.trim()) return json({ ok: true, empty: true });

    const phone = remoteJid.split("@")[0];
    const contactName = data?.pushName ?? null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings } = await supabase
      .from("bot_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!settings || settings.webhook_secret !== secret) {
      return json({ error: "invalid secret" }, 401);
    }
    if (!settings.is_active) {
      return json({ ok: true, inactive: true });
    }

    // Carrega/cria conversa
    const { data: conv } = await supabase
      .from("bot_conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("contact_phone", phone)
      .maybeSingle();

    const transcript: any[] = (conv?.transcript as any[]) ?? [];
    transcript.push({ role: "user", content: messageText, at: new Date().toISOString() });

    // Handoff por palavra-chave ou limite
    const lower = messageText.toLowerCase();
    const keywordHit = (settings.handoff_keywords ?? []).some((k: string) => lower.includes(k.toLowerCase()));
    const limitHit = transcript.length >= (settings.max_messages_before_handoff ?? 10);

    let replyText = "";
    let status = conv?.status ?? "active";

    if (status === "handed_off") {
      // Já foi para humano, não responde
      await persist(supabase, userId, phone, contactName, transcript, status);
      return json({ ok: true, handed: true });
    }

    if (keywordHit || limitHit) {
      replyText = settings.fallback_message;
      status = "handed_off";
    } else {
      // Chama Lovable AI
      const aiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!aiKey) {
        replyText = settings.fallback_message;
      } else {
        const messages = [
          { role: "system", content: settings.system_prompt },
          ...transcript.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        ];
        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${aiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: settings.ai_model?.startsWith("google/") || settings.ai_model?.startsWith("openai/")
              ? settings.ai_model
              : "google/gemini-3-flash-preview",
            messages,
            temperature: Number(settings.ai_temperature ?? 0.7),
          }),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          replyText = aiJson?.choices?.[0]?.message?.content?.trim() || settings.fallback_message;
        } else {
          console.error("AI error", aiRes.status, await aiRes.text());
          replyText = settings.fallback_message;
        }
      }
    }

    transcript.push({ role: "assistant", content: replyText, at: new Date().toISOString() });
    await persist(supabase, userId, phone, contactName, transcript, status);

    // Envia para Evolution
    const instance = settings.whatsapp_instance;
    const evoUrl = Deno.env.get("EVOLUTION_API_URL");
    const evoKey = Deno.env.get("EVOLUTION_API_KEY");
    if (instance && evoUrl && evoKey) {
      const delay = Math.max(0, Number(settings.auto_reply_delay_seconds ?? 0)) * 1000;
      if (delay) await new Promise((r) => setTimeout(r, delay));
      const sendRes = await fetch(`${evoUrl}/message/sendText/${instance}`, {
        method: "POST",
        headers: { apikey: evoKey, "Content-Type": "application/json" },
        body: JSON.stringify({ number: phone, text: replyText }),
      });
      if (!sendRes.ok) console.error("send error", sendRes.status, await sendRes.text());
    }

    return json({ ok: true, replied: true });
  } catch (e) {
    console.error("webhook error", e);
    return json({ error: String(e) }, 500);
  }
});

async function persist(
  supabase: any,
  userId: string,
  phone: string,
  name: string | null,
  transcript: any[],
  status: string
) {
  await supabase.from("bot_conversations").upsert(
    {
      user_id: userId,
      contact_phone: phone,
      contact_name: name,
      transcript,
      status,
      messages_count: transcript.length,
      last_message_at: new Date().toISOString(),
    },
    { onConflict: "user_id,contact_phone" }
  );
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}