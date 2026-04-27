import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/estoque/atual")({
  component: () => (
    <PagePlaceholder 
      title="Estoque Atual" 
      subtitle="Gestão de Inventário"
      description="Visão geral do seu estoque. Controle de IMEIs, cores, capacidades e modelos de smartphones novos e usados."
    />
  ),
});
