import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/estoque/movimentacoes")({
  component: () => (
    <PagePlaceholder 
      title="Movimentações de Estoque" 
      subtitle="Log de Entradas e Saídas"
      description="Histórico completo de quem mexeu no estoque, quando e por que. Segurança e rastreabilidade total."
    />
  ),
});
