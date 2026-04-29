import { useEffect, useState } from "react";
import { Award, Loader2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProductRow {
  name: string;
  quantity: number;
  revenue: number;
}

export function TopProducts() {
  const { user } = useAuth();
  const [items, setItems] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const firstDayMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const { data: orders } = await supabase
          .from("sales_orders")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "concluded")
          .gte("created_at", firstDayMonth);

        const orderIds = (orders || []).map((o: any) => o.id);
        if (orderIds.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }

        const { data: itemsData } = await supabase
          .from("sales_order_items")
          .select("quantity, total_price, products(name)")
          .in("sales_order_id", orderIds);

        const aggMap: Record<string, ProductRow> = {};
        (itemsData || []).forEach((it: any) => {
          const name = it.products?.name || "Produto";
          if (!aggMap[name]) aggMap[name] = { name, quantity: 0, revenue: 0 };
          aggMap[name].quantity += Number(it.quantity || 0);
          aggMap[name].revenue += Number(it.total_price || 0);
        });

        const top = Object.values(aggMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        setItems(top);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const max = Math.max(1, ...items.map((i) => i.revenue));

  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold flex items-center gap-2">
          <Award className="h-4 w-4 text-warning" />
          Top Produtos
        </h3>
        <span className="text-[10.5px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          Este mês
        </span>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/30" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-muted/60 grid place-items-center mb-2">
            <Package className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <p className="text-xs text-muted-foreground italic">Sem vendas neste mês</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((p, idx) => {
            const pct = (p.revenue / max) * 100;
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <li key={p.name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm w-5 text-center">
                      {medals[idx] ?? <span className="text-muted-foreground text-[11px] font-semibold">#{idx + 1}</span>}
                    </span>
                    <span className="text-[13px] font-medium truncate">{p.name}</span>
                  </div>
                  <span className="text-[12px] font-semibold tabular-nums shrink-0 ml-2">
                    {p.revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-primary transition-all duration-700 group-hover:opacity-90"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[10.5px] text-muted-foreground mt-1">
                  {p.quantity} {p.quantity === 1 ? "unidade" : "unidades"}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}