import { messages, recentLeads } from "@/lib/mock";

export function RecentService() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <h3 className="text-[15px] font-semibold mb-3">Atendimentos recentes</h3>
      <ul className="space-y-2">
        {messages.slice(0, 2).map((m) => (
          <li key={m.name} className="flex items-start gap-3 rounded-xl border border-border p-3">
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-white text-xs font-semibold">
                {m.name.split(" ").map(s => s[0]).slice(0,2).join("")}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${m.channel === "whatsapp" ? "bg-success" : "bg-[oklch(0.65_0.2_330)]"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold">{m.name}</span>
                <span className="text-[10.5px] text-muted-foreground">{m.time}</span>
              </div>
              <span className="text-[10.5px] inline-block px-1.5 py-0.5 rounded bg-muted text-muted-foreground my-1">
                {m.channel === "whatsapp" ? "WhatsApp" : "Instagram"}
              </span>
              <p className="text-[12px] text-muted-foreground truncate">{m.text}</p>
            </div>
            {m.unread > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground grid place-items-center">{m.unread}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const etapaStyle = (e: string) => {
  switch (e) {
    case "Novo Contato": return "bg-info/15 text-info";
    case "Em Atendimento": return "bg-warning/20 text-[oklch(0.5_0.15_75)]";
    case "Proposta": return "bg-primary/15 text-primary";
    default: return "bg-muted text-muted-foreground";
  }
};

export function RecentLeads() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <h3 className="text-[15px] font-semibold mb-3">Leads recentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-muted-foreground text-[11px] uppercase tracking-wide">
              <th className="font-medium pb-2">Nome</th>
              <th className="font-medium pb-2">Origem</th>
              <th className="font-medium pb-2">Responsável</th>
              <th className="font-medium pb-2">Etapa</th>
              <th className="font-medium pb-2 text-right">Horário</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentLeads.map((l) => (
              <tr key={l.name} className="hover:bg-muted/40 transition">
                <td className="py-2.5 font-medium">{l.name}</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-foreground/80">
                    <span className={`h-2 w-2 rounded-full ${l.origin === "WhatsApp" ? "bg-success" : "bg-[oklch(0.65_0.2_330)]"}`} />
                    {l.origin}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-gradient-primary text-white text-[9px] font-bold grid place-items-center">
                      {l.responsavel.split(" ").map(s=>s[0]).slice(0,2).join("")}
                    </span>
                    {l.responsavel}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded ${etapaStyle(l.etapa)}`}>{l.etapa}</span>
                </td>
                <td className="py-2.5 text-right text-muted-foreground">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
