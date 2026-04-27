import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/servicos")({
  component: () => (
    <PagePlaceholder 
      title="Ordem de Serviço" 
      subtitle="Gestão de Assistência Técnica"
      description="Acompanhe reparos, checklists de entrada/saída, estoque de peças e produtividade dos técnicos da sua loja."
    />
  ),
});
