import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/vendas/garantias")({
  component: () => (
    <PagePlaceholder 
      title="Monitoramento de Garantias" 
      subtitle="Pós-venda e Assistência"
      description="Controle o prazo de garantia de cada aparelho vendido por IMEI. Seja notificado antes do vencimento."
    />
  ),
});
