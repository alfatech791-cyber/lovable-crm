 import * as Icons from "lucide-react";
 import { useNavigate } from "@tanstack/react-router";

 type Tone = "info" | "success" | "warning" | "primary" | "destructive";
 const toneStyles: Record<Tone, string> = {
   info: "bg-info/10 text-info",
   success: "bg-success/10 text-success",
   warning: "bg-warning/15 text-[oklch(0.55_0.15_75)]",
   primary: "bg-primary/10 text-primary",
   destructive: "bg-destructive/10 text-destructive",
 };

  export function KpiCard({
    label, value, trend, sub, icon, tone, onClick
  }: { label: string; value: string; trend: string; sub: string; icon: string; tone: string; onClick?: () => void }) {
   const Icon = (Icons as any)[icon] ?? Icons.Activity;
   const navigate = useNavigate();
 
   const handleClick = () => {
     if (onClick) {
       onClick();
       return;
     }
     const l = label.toLowerCase();
     if (l.includes("vendas") || l.includes("faturamento") || l.includes("ticket")) {
       navigate({ to: "/vendas/historico" as any });
     } else if (l.includes("os")) {
       navigate({ to: "/servicos/dashboard" as any });
     } else if (l.includes("estoque")) {
       navigate({ to: "/estoque/atual" as any });
     } else if (l.includes("leads")) {
       navigate({ to: "/leads" as any });
     }
   };
 
   return (
     <button 
       onClick={handleClick}
       className="rounded-2xl bg-card border border-border p-4 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all text-left w-full group"
     >
       <div className="flex items-start gap-3">
         <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-110 ${toneStyles[tone as Tone]}`}>
           <Icon className="h-[18px] w-[18px]" />
         </div>
         <div className="min-w-0 flex-1">
           <div className="text-[12px] text-muted-foreground font-medium group-hover:text-primary transition-colors">{label}</div>
           <div className="mt-0.5 flex items-baseline gap-1.5">
             <span className="text-[22px] font-bold tracking-tight font-display">{value}</span>
             <span className="text-[11px] font-semibold text-success">↑ {trend.replace("+","")}</span>
           </div>
           <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
         </div>
       </div>
     </button>
   );
 }
