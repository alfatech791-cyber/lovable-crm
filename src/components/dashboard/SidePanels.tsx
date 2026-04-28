 import { agenda, automations, tasks } from "@/lib/mock";
 import { ArrowRight, Send, CheckCircle2, MessageSquare, Zap, ChevronLeft, ChevronRight } from "lucide-react";
 import { useState } from "react";
 import { useNavigate } from "@tanstack/react-router";

export function TasksCard() {
   const navigate = useNavigate();
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <h3 className="text-[15px] font-semibold mb-3">Tarefas do dia</h3>
      <ul className="space-y-2">
        {tasks.length > 0 ? tasks.map((t) => (
          <li key={t.text} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/60 transition">
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
            <span className="flex-1 text-[13px]">{t.text}</span>
            <span className="text-[11px] text-muted-foreground font-semibold">{t.count}</span>
          </li>
        )) : (
          <li className="text-center py-6 text-xs text-muted-foreground italic">Sem tarefas para hoje</li>
        )}
      </ul>
       <button 
        onClick={() => navigate({ to: "/_app/agendamentos/" as any })}
         className="w-full mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:bg-muted rounded-lg py-2 transition"
       >
         Ver todas as tarefas <ArrowRight className="h-3.5 w-3.5" />
       </button>
    </div>
  );
}

  export function AutomationsCard() {
    const navigate = useNavigate();
   return (
     <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
       <div className="flex items-center justify-between mb-3">
         <h3 className="text-[15px] font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-warning" /> Automação</h3>
         <span className="text-[11px] font-semibold text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">{automations.length} Ativas</span>
       </div>
       <ul className="space-y-2.5">
         {automations.length > 0 ? automations.map((a) => (
           <li key={a.name} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:shadow-card transition">
             <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${a.status === "Ativo" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
               {a.status === "Ativo" ? <CheckCircle2 className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                 <span className="text-[13px] font-semibold truncate">{a.name}</span>
                 <span className={`text-[10px] px-1.5 py-0.5 rounded ${a.status === "Ativo" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"} font-semibold`}>{a.status}</span>
               </div>
               <div className="text-[11px] text-muted-foreground">Próximo: {a.next}</div>
             </div>
             <span className="text-[12px] font-bold font-display">{a.count}</span>
           </li>
         )) : (
          <li className="text-center py-6 text-xs text-muted-foreground italic border border-dashed border-border rounded-xl">Nenhuma automação configurada</li>
         )}
       </ul>
       <button 
         onClick={() => navigate({ to: "/automacao" })}
         className="w-full mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:bg-muted rounded-lg py-2 transition"
       >
         Ver todas as automações <ArrowRight className="h-3.5 w-3.5" />
       </button>
    </div>
  );
}

 export function AgendaCard() {
   const navigate = useNavigate();
  const [m] = useState(new Date(2026, 4, 24));
  const days = ["D","S","T","Q","Q","S","S"];
  const monthName = m.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  // build a static-ish grid
  const grid = Array.from({ length: 35 }, (_, i) => i - 3);
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <h3 className="text-[15px] font-semibold mb-3">Compromissos</h3>
      <div className="flex items-center justify-between mb-2">
        <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"><ChevronLeft className="h-4 w-4" /></button>
        <span className="text-[13px] font-semibold capitalize">{monthName}</span>
        <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] text-muted-foreground mb-1">
        {days.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11.5px]">
        {grid.map((n) => {
          const day = n;
          const valid = day >= 1 && day <= 31;
          const today = day === 24;
          return (
            <span key={n} className={`h-7 grid place-items-center rounded-md ${today ? "bg-primary text-primary-foreground font-bold" : valid ? "hover:bg-muted cursor-pointer" : "text-muted-foreground/40"}`}>
              {valid ? day : ""}
            </span>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="text-[12px] font-semibold mb-2">Hoje · 24 de maio</div>
        <ul className="space-y-1.5">
          {agenda.length > 0 ? agenda.map((a) => (
            <li key={a.title} className="flex items-center gap-2 text-[12px]">
              <span className="text-primary font-semibold w-10">{a.time}</span>
              <span className="text-foreground/85 truncate">{a.title}</span>
            </li>
          )) : (
            <li className="text-center py-4 text-xs text-muted-foreground italic">Sem compromissos hoje</li>
          )}
        </ul>
         <button 
           onClick={() => navigate({ to: "/_app/agendamentos/" as any })}
           className="w-full mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:bg-muted rounded-lg py-2 transition"
         >
           Ver agenda completa <ArrowRight className="h-3.5 w-3.5" />
         </button>
      </div>
    </div>
  );
}

 export function DispatchCard() {
   const navigate = useNavigate();
  const items = [
    { icon: Send, label: "Total de mensagens", value: "256", color: "var(--color-primary)" },
    { icon: CheckCircle2, label: "Entregues", value: "238", sub: "(93%)", color: "var(--color-success)" },
    { icon: MessageSquare, label: "Respostas", value: "89", sub: "(35%)", color: "oklch(0.65 0.2 330)" },
  ];
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <h3 className="text-[15px] font-semibold mb-3">Disparos de hoje</h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="text-center">
              <div className="h-10 w-10 mx-auto rounded-xl grid place-items-center mb-1.5" style={{ background: `color-mix(in oklab, ${it.color} 15%, transparent)`, color: it.color }}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-[10.5px] text-muted-foreground leading-tight">{it.label}</div>
              <div className="font-bold font-display text-[15px] mt-0.5">{it.value} {it.sub && <span className="text-[10px] text-success font-semibold">{it.sub}</span>}</div>
            </div>
          );
        })}
      </div>
       <button 
         onClick={() => navigate({ to: "/relatorios" })}
         className="w-full mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:bg-muted rounded-lg py-2 transition"
       >
         Ver relatórios completos <ArrowRight className="h-3.5 w-3.5" />
       </button>
    </div>
  );
}
