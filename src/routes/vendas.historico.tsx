import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/vendas/historico")({
  component: () => (
    <PagePlaceholder 
      title="Histórico de Vendas" 
      subtitle="Relatório Detalhado"
      description="Consulte todas as vendas realizadas, filtre por período, vendedor ou tipo de pagamento. Exporte relatórios para sua gestão."
    />
  ),
});
