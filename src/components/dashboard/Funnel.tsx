import { funnelStages } from "@/lib/mock";
import { Trophy } from "lucide-react";

const channelIcon = (c: string) => c === "WhatsApp" ? "💬" : "📷";

export function Funnel() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <h3 className="text-[15px] font-semibold mb-4">Funil de Vendas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {funnelStages.map((s) => (
          <div key={s.key} className="rounded-xl bg-muted/40 border border-border p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span className="text-[13px] font-semibold flex-1">{s.label}</span>
              {s.key === "fechado" && <Trophy className="h-3.5 w-3.5 text-warning" />}
            </div>
            <div className="flex items-baseline justify-between text-[11px] mb-3">
              <span className="text-muted-foreground">{s.count} leads</span>
              <span className="font-semibold text-foreground">{s.total}</span>
            </div>
            <ul className="space-y-2">
              {s.leads.map((l) => (
                <li key={l.name} className="flex items-center gap-2.5 rounded-lg bg-card border border-border p-2 hover:shadow-card transition">
                  <div className="relative h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-[10px] font-semibold text-white shrink-0">
                    {l.avatar}
                    <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">{channelIcon(l.channel)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium truncate leading-tight">{l.name}</div>
                    <div className="text-[10.5px] text-muted-foreground">{l.channel} · {l.time}</div>
                  </div>
                  {(l as any).won && <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success font-semibold">Ganho</span>}
                </li>
              ))}
            </ul>
            <button className="mt-3 w-full text-[11px] text-muted-foreground hover:text-primary transition">+ Ver mais {s.count - s.leads.length}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
