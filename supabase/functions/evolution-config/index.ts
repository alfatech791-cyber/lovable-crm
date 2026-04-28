// Funções auxiliares para gerenciar instâncias Evolution e webhooks
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return j({ error: "unauthorized" }, 401);

    const evoUrl = Deno.env.get("EVOLUTION_API_URL");
    const evoKey = Deno.env.get("EVOLUTION_API_KEY");
    if (!evoUrl || !evoKey) return j({ error: "Evolution não configurada" }, 500);

    const { action, instance, webhookUrl } = await req.json();

    const headers = { apikey: evoKey, "Content-Type": "application/json" };

    if (action === "list") {
      const r = await fetch(`${evoUrl}/instance/fetchInstances`, { headers });
      const data = await r.json();
      return j({ instances: data });
    }

    if (action === "create") {
      if (!instance) return j({ error: "instance required" }, 400);
      const r = await fetch(`${evoUrl}/instance/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({ instanceName: instance, integration: "WHATSAPP-BAILEYS", qrcode: true }),
      });
      const data = await r.json();
      if (r.ok) {
        await supabase.from("whatsapp_instances").upsert(
          { user_id: user.id, instance_name: instance, status: "connecting" },
          { onConflict: "instance_name" }
        );
      }
      return j(data, r.status);
    }

    if (action === "qr") {
      if (!instance) return j({ error: "instance required" }, 400);
      const r = await fetch(`${evoUrl}/instance/connect/${instance}`, { headers });
      return j(await r.json(), r.status);
    }

    if (action === "status") {
      if (!instance) return j({ error: "instance required" }, 400);
      const r = await fetch(`${evoUrl}/instance/connectionState/${instance}`, { headers });
      const data = await r.json();
      const state = data?.instance?.state ?? data?.state ?? "unknown";
      const mapped = state === "open" ? "connected" : state === "connecting" ? "connecting" : "disconnected";
      await supabase.from("whatsapp_instances")
        .update({ status: mapped }).eq("user_id", user.id).eq("instance_name", instance);
      return j({ state: mapped });
    }

    if (action === "delete") {
      if (!instance) return j({ error: "instance required" }, 400);
      const r = await fetch(`${evoUrl}/instance/delete/${instance}`, { method: "DELETE", headers });
      await supabase.from("whatsapp_instances").delete().eq("user_id", user.id).eq("instance_name", instance);
      return j(await r.json().catch(() => ({})), r.status);
    }

    if (action === "set_webhook") {
      if (!instance || !webhookUrl) return j({ error: "instance and webhookUrl required" }, 400);
      const r = await fetch(`${evoUrl}/webhook/set/${instance}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          webhook: { url: webhookUrl, enabled: true, events: ["MESSAGES_UPSERT"], byEvents: false, base64: false },
        }),
      });
      return j(await r.json().catch(() => ({ ok: r.ok })), r.status);
    }

    return j({ error: "unknown action" }, 400);
  } catch (e) {
    return j({ error: String(e) }, 500);
  }
});

function j(b: unknown, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
}