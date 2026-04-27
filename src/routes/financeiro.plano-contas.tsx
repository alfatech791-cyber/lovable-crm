import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/financeiro/plano-contas")({
  component: () => (
    <PagePlaceholder 
      title="Plano de Contas" 
      subtitle="Categorização Financeira"
      description="Organize suas receitas e despesas por categorias para facilitar a análise do DRE."
    />
  ),
});
