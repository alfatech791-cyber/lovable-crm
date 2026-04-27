import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/servicos/checklists")({
  component: () => (
    <PagePlaceholder 
      title="Modelos de Checklist" 
      subtitle="Padronização de Testes"
      description="Defina os itens que devem ser testados na entrada e na saída do aparelho (WiFi, Câmera, FaceID, etc.)."
    />
  ),
});
