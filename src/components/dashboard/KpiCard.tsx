import {
  Activity,
  ShoppingBag,
  Wrench,
  Box,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
 import { useNavigate } from "@tanstack/react-router";

 type Tone = "info" | "success" | "warning" | "primary" | "destructive";
 const toneStyles: Record<Tone, { icon: string; gradient: string; ring: string }> = {
   info:        { icon: "bg-info/10 text-info",                                 gradient: "from-info/8 to-info/0",                ring: "ring-info/20" },
   success:     { icon: "bg-success/10 text-success",                           gradient: "from-success/8 to-success/0",          ring: "ring-success/20" },
   warning:     { icon: "bg-warning/15 text-[oklch(0.55_0.15_75)]",             gradient: "from-warning/10 to-warning/0",         ring: "ring-warning/20" },
   primary:     { icon: "bg-primary/10 text-primary",                           gradient: "from-primary/10 to-primary/0",         ring: "ring-primary/20" },
   destructive: { icon: "bg-destructive/10 text-destructive",                   gradient: "from-destructive/8 to-destructive/0",  ring: "ring-destructive/20" },
 };

  export function KpiCard({
    label, value, trend, sub, icon, tone, onClick
  }: { label: string; value: string; trend: string; sub: string; icon: string; tone: string; onClick?: () => void }) {
   const IconsMap: Record<string, any> = {
     ShoppingBag,
     Wrench,
     Box,
     DollarSign,
     Users,
     TrendingUp
   };
   const Icon = IconsMap[icon] ?? Activity;
   const navigate = useNavigate();
   const styles = toneStyles[tone as Tone] ?? toneStyles.primary;
 
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
       className={`relative overflow-hidden rounded-2xl bg-card border border-border p-4 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all text-left w-full group hover:ring-2 ${styles.ring}`}
     >
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
        <ArrowUpRight className="absolute top-3 right-3 h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
       <div className="flex items-start gap-3 relative">
         <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 ${styles.icon}`}>
           <Icon className="h-[18px] w-[18px]" />
         </div>
         <div className="min-w-0 flex-1">
           <div className="text-[11.5px] text-muted-foreground font-medium group-hover:text-foreground transition-colors pr-5">{label}</div>
           <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-[20px] lg:text-[22px] font-bold tracking-tight font-display truncate">{value}</span>
              {trend && <span className="text-[10px] font-semibold text-success whitespace-nowrap">↑ {trend.replace("+","")}</span>}
           </div>
           <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
         </div>
       </div>
     </button>
   );
 }
