import { Target, TrendingUp } from "lucide-react";

interface GoalProgressProps {
  current: number;
  goal?: number;
}

export function GoalProgress({ current, goal = 50000 }: GoalProgressProps) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  const remaining = Math.max(0, goal - current);
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const expectedPct = Math.round((dayOfMonth / daysInMonth) * 100);
  const onTrack = pct >= expectedPct;

  // SVG ring
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card relative overflow-hidden">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-2xl bg-gradient-primary" />
      <div className="flex items-center justify-between mb-4 relative">
        <div>
          <h3 className="text-[15px] font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Meta do Mês
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {dayOfMonth} de {daysInMonth} dias decorridos
          </p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${onTrack ? "bg-success/15 text-success" : "bg-warning/15 text-[oklch(0.55_0.15_75)]"}`}>
          {onTrack ? "No ritmo" : "Atrasado"}
        </span>
      </div>

      <div className="flex items-center gap-4 relative min-w-0">
        <div className="relative h-[120px] w-[120px] sm:h-[130px] sm:w-[130px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="oklch(0.65 0.2 330)" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={radius} stroke="var(--color-muted)" strokeWidth="10" fill="none" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#goalGrad)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-[28px] font-bold font-display tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                {pct}%
              </div>
              <div className="text-[10px] text-muted-foreground">atingido</div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">Realizado</div>
            <div className="text-base sm:text-lg font-bold font-display truncate">
              {current.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">Meta</div>
            <div className="text-xs sm:text-sm font-semibold text-foreground/70 truncate">
              {goal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
          <div className="pt-2 border-t border-border min-w-0">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Faltam
            </div>
            <div className="text-[13px] font-semibold text-primary truncate">
              {remaining.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}