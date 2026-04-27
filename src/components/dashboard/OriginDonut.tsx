import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { originData } from "@/lib/mock";

export function OriginDonut() {
  const total = originData.reduce((a, b) => a + b.value, 0);
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <h3 className="text-[15px] font-semibold mb-3">Origem dos leads</h3>
      <div className="flex items-center gap-4">
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={originData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">
                {originData.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              <div className="text-[11px] text-muted-foreground">Total</div>
              <div className="text-xl font-bold font-display">{total.toLocaleString("pt-BR")}</div>
            </div>
          </div>
        </div>
        <ul className="flex-1 space-y-2">
          {originData.map((d) => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <li key={d.name} className="flex items-center gap-2.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="flex-1 text-foreground/80">{d.name}</span>
                <span className="font-semibold">{pct}%</span>
                <span className="text-muted-foreground">({d.value})</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
