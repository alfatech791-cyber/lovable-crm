// Envia mensagem manual pelo WhatsApp via Evolution e grava no transcript
// da conversa do usuário autenticado.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const auth = req.headers.get("Authorization") ?? "";
    if (!auth.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );

    const { data: userRes, error: userErr } = await supabase.auth.getUser(
      auth.replace("Bearer ", "")
    );
    if (userErr || !userRes?.user) return json({ error: "unauthorized" }, 401);
    const userId = userRes.user.id;

    const body = await req.json().catch(() => ({}));
    const phone: string = String(body.phone ?? "").replace(/\D/g, "");
    const text: string = String(body.text ?? "").trim();
    const contactName: string | null = body.contactName ?? null;
    const stopBot: boolean = !!body.stopBot;

    if (!phone || !text) return json({ error: "phone and text required" }, 400);

    const { data: settings } = await supabase
      .from("bot_settings")
      .select("whatsapp_instance")
      .eq("user_id", userId)
      .maybeSingle();

    const instance = settings?.whatsapp_instance;
    const evoUrl = Deno.env.get("EVOLUTION_API_URL");
    const evoKey = Deno.env.get("EVOLUTION_API_KEY");

    let sendOk = false;
    let sendError: string | null = null;
    if (instance && evoUrl && evoKey) {
      const sendRes = await fetch(`${evoUrl}/message/sendText/${instance}`, {
        method: "POST",
        headers: { apikey: evoKey, "Content-Type": "application/json" },
        body: JSON.stringify({ number: phone, text }),
      });
      sendOk = sendRes.ok;
      if (!sendRes.ok) sendError = `${sendRes.status}: ${await sendRes.text()}`;
    } else {
      sendError = "Evolution não configurada (instância/URL/KEY)";
    }

    // Grava no transcript independentemente (assim aparece no app)
    const { data: conv } = await supabase
      .from("bot_conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("contact_phone", phone)
      .maybeSingle();

    const transcript: any[] = (conv?.transcript as any[]) ?? [];
    transcript.push({
      role: "agent",
      content: text,
      at: new Date().toISOString(),
      sent: sendOk,
    });

    await supabase.from("bot_conversations").upsert(
      {
        user_id: userId,
        contact_phone: phone,
        contact_name: conv?.contact_name ?? contactName,
        transcript,
        status: stopBot ? "handed_off" : conv?.status ?? "active",
        messages_count: transcript.length,
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "user_id,contact_phone" }
    );

    return json({ ok: sendOk, error: sendError });
  } catch (e) {
    console.error("send-whatsapp error", e);
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}