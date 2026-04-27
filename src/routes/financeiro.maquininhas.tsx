import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/financeiro/maquininhas")({
  component: () => (
    <PagePlaceholder 
      title="Maquininhas POS" 
      subtitle="Histórico de Pagamentos"
      description="Controle o recebimento das vendas em cartão e confira se as taxas estão sendo aplicadas corretamente."
    />
  ),
});
