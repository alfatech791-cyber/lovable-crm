// Motor de automações do pipeline.
// Recebe { user_id, trigger_type, payload } e executa toda automação ativa
// correspondente, registrando em automation_runs.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Payload = {
  user_id: string;
  trigger_type: string;
  payload: Record<string, any>;
};

function interpolate(tpl: string, vars: Record<string, any>) {
  return (tpl || "").replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
    const v = k.split(".").reduce((acc: any, p: string) => acc?.[p], vars);
    return v == null ? "" : String(v);
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: corsHeaders });
  }

  const { user_id, trigger_type, payload = {} } = body || ({} as Payload);
  if (!user_id || !trigger_type) {
    return new Response(JSON.stringify({ error: "missing user_id or trigger_type" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Busca automações ativas para este gatilho
  const { data: automations, error: autErr } = await admin
    .from("automations")
    .select("*")
    .eq("user_id", user_id)
    .eq("trigger_type", trigger_type)
    .eq("is_active", true);

  if (autErr) {
    return new Response(JSON.stringify({ error: autErr.message }), { status: 500, headers: corsHeaders });
  }

  if (!automations?.length) {
    return new Response(JSON.stringify({ ok: true, executed: 0 }), { headers: corsHeaders });
  }

  // Carrega lead se houver
  let lead: any = null;
  if (payload.lead_id) {
    const { data } = await admin.from("leads").select("*").eq("id", payload.lead_id).maybeSingle();
    lead = data;
  }

  let executed = 0;
  for (const a of automations) {
    const cfg = (a.config ?? {}) as Record<string, any>;
    const vars = { ...payload, lead, nome: lead?.name, telefone: lead?.phone, mensagem: payload.content };

    try {
      switch (a.action_type) {
        case "send_message": {
          const phone = lead?.phone || payload.phone;
          if (!phone) throw new Error("lead sem telefone");
          const text = interpolate(cfg.message ?? "", vars);
          if (!text.trim()) throw new Error("mensagem vazia");

          const res = await fetch(`${SUPABASE_URL}/functions/v1/send-whatsapp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SERVICE_ROLE}`,
              apikey: SERVICE_ROLE,
              "x-user-id": user_id,
            },
            body: JSON.stringify({ phone, text, contactName: lead?.name }),
          });
          if (!res.ok) throw new Error(`send-whatsapp ${res.status}`);
          break;
        }

        case "create_task": {
          await admin.from("tasks").insert({
            user_id,
            lead_id: lead?.id ?? payload.lead_id ?? null,
            title: interpolate(cfg.title ?? a.name ?? "Tarefa automática", vars),
            description: interpolate(cfg.description ?? "", vars),
            priority: cfg.priority ?? "medium",
            status: "pending",
            due_date: cfg.due_in_hours
              ? new Date(Date.now() + Number(cfg.due_in_hours) * 3600_000).toISOString()
              : null,
          });
          break;
        }

        case "move_pipeline": {
          if (!lead?.id) throw new Error("lead ausente");
          let stageId: string | null = cfg.stage_id ?? null;
          if (!stageId && cfg.stage_name) {
            const { data: st } = await admin
              .from("funnel_stages")
              .select("id")
              .eq("user_id", user_id)
              .ilike("name", cfg.stage_name)
              .maybeSingle();
            stageId = st?.id ?? null;
          }
          if (!stageId) throw new Error("stage_id/stage_name não configurado");
          await admin.from("pipeline_leads").update({ stage_id: stageId }).eq("user_id", user_id).eq("lead_id", lead.id);
          break;
        }

        case "notify_team": {
          // Cria uma tarefa de notificação visível no painel
          await admin.from("tasks").insert({
            user_id,
            lead_id: lead?.id ?? payload.lead_id ?? null,
            title: interpolate(cfg.title ?? `🔔 ${a.name}`, vars),
            description: interpolate(cfg.message ?? "Notificação automática do pipeline", vars),
            priority: "high",
            status: "pending",
          });
          break;
        }

        default:
          throw new Error(`ação desconhecida: ${a.action_type}`);
      }

      await admin.from("automation_runs").insert({
        user_id,
        automation_id: a.id,
        trigger_type,
        action_type: a.action_type,
        status: "success",
        payload,
      });
      executed++;
    } catch (e) {
      await admin.from("automation_runs").insert({
        user_id,
        automation_id: a.id,
        trigger_type,
        action_type: a.action_type,
        status: "error",
        payload,
        error: (e as Error).message,
      });
    }
  }

  return new Response(JSON.stringify({ ok: true, executed }), { headers: corsHeaders });
});