import { StockList } from "@/components/estoque/StockList";

export default function ListaEstoquePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Lista de Produtos</h1>
      <StockList />
    </div>
  );
}
