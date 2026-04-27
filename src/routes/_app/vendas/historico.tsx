import { SalesHistory } from "@/components/vendas/SalesHistory";

export default function HistoricoVendasPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Histórico de Vendas</h1>
      <SalesHistory />
    </div>
  );
}
