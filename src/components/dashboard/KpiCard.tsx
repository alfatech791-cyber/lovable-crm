import {
  Activity, ShoppingBag, Wrench, Box, DollarSign, Users,
  TrendingUp, ArrowUpRight, Calendar, Info, Target, AlertTriangle
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

type Tone = "info" | "success" | "warning" | "primary" | "destructive";
 const toneStyles: Record<Tone, { icon: string; gradient: string; ring: string }> = {
   info:        { icon: "bg-info/10 text-info",                       gradient: "from-info/10 to-transparent",        ring: "ring-info/20" },
   success:     { icon: "bg-success/10 text-success",                 gradient: "from-success/10 to-transparent",     ring: "ring-success/20" },
   warning:     { icon: "bg-warning/15 text-[oklch(0.55_0.15_75)]",   gradient: "from-warning/10 to-transparent",     ring: "ring-warning/20" },
   primary:     { icon: "bg-primary/10 text-primary",                 gradient: "from-primary/10 to-transparent",     ring: "ring-primary/20" },
   destructive: { icon: "bg-destructive/10 text-destructive",         gradient: "from-destructive/10 to-transparent", ring: "ring-destructive/20" },
 };

export function KpiCard({
  label, value, trend, sub, icon, tone, onClick
}: { label: string; value: string; trend: string; sub: string; icon: string; tone: string; onClick?: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const IconsMap: Record<string, any> = { ShoppingBag, Wrench, Box, DollarSign, Users, TrendingUp };
  const Icon = IconsMap[icon] ?? Activity;
  const navigate = useNavigate();
  const styles = toneStyles[tone as Tone] ?? toneStyles.primary;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className={`relative overflow-hidden rounded-2xl bg-card border border-border p-3 sm:p-4 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all text-left w-full group hover:ring-2 min-w-0 ${styles.ring}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0`} />
        <div 
          onClick={handleAction}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-primary/10 transition-colors z-20 cursor-pointer"
          title="Ver detalhes na página"
        >
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div className="flex items-start gap-3 relative z-10">
          <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 ${styles.icon}`}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11.5px] text-muted-foreground font-medium group-hover:text-foreground transition-colors pr-5">{label}</div>
            <div className="mt-0.5 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[17px] sm:text-[20px] lg:text-[22px] font-bold tracking-tight font-display truncate max-w-full">{value}</span>
              {trend && <span className="text-[10px] font-semibold text-success whitespace-nowrap">↑ {trend.replace("+","")}</span>}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
          </div>
        </div>
      </button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-12 w-12 rounded-2xl grid place-items-center ${styles.icon}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{label}</DialogTitle>
                <DialogDescription>{sub}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 text-center">
              <span className="text-sm text-muted-foreground block mb-1">Valor Atual</span>
              <span className="text-4xl font-black font-display tracking-tight text-primary">{value}</span>
              {trend && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold">
                  <TrendingUp className="h-3 w-3" />
                  +{trend.replace("+","")} Crescimento
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Período</span>
                </div>
                <p className="text-sm font-semibold">Hoje</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                  <Target className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Meta</span>
                </div>
                <p className="text-sm font-semibold">Em dia</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-orange-50/50 dark:bg-orange-900/10 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 grid place-items-center shrink-0">
                <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-orange-900 dark:text-orange-100">Dica Estratégica</h4>
                <p className="text-xs text-orange-800/80 dark:text-orange-200/60 mt-0.5">
                  Mantenha este indicador sempre monitorado para garantir a saúde do seu negócio.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button 
              onClick={handleAction}
              className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Acessar Relatório Completo
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
