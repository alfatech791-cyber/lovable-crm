import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/servicos/termos")({
  component: () => (
    <PagePlaceholder 
      title="Termos de Garantia" 
      subtitle="Documentação Legal"
      description="Configure os termos de garantia e avisos legais que aparecem na impressão da sua OS."
    />
  ),
});
