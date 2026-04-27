import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/vendas/orcamentos")({
  component: () => (
    <PagePlaceholder 
      title="Orçamentos" 
      subtitle="Propostas e Pré-vendas"
      description="Gere e gerencie orçamentos para seus clientes. Envie propostas personalizadas via WhatsApp com apenas um clique."
    />
  ),
});
