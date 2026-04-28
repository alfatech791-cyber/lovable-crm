import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { salesData } from "@/lib/mock";
import { ChevronDown } from "lucide-react";

export function SalesChart() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-[15px] font-semibold">Desempenho de vendas</h3>
        </div>
        <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1.5 hover:bg-muted">
          Este mês <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[26px] font-bold font-display tracking-tight">R$ 0,00</span>
        <span className="text-xs text-muted-foreground font-semibold">0% <span className="text-muted-foreground font-normal">vs mês anterior</span></span>
      </div>
      <div className="h-[200px] -ml-2">
        <ResponsiveContainer>
          <AreaChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} interval={4} />
            <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Vendas"]}
            />
            <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#salesGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
