import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/servicos/nova")({
  component: () => (
    <PagePlaceholder 
      title="Nova Ordem de Serviço" 
      subtitle="Abertura de Chamado"
      description="Formulário completo para entrada de aparelhos, diagnóstico inicial e registro de senha/acessórios."
    />
  ),
});
