import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/estoque/vendidos")({
  component: () => (
    <PagePlaceholder 
      title="Produtos Vendidos/Sem Estoque" 
      subtitle="Análise de Giro"
      description="Veja quais modelos estão saindo mais e quais precisam de reposição urgente para não perder vendas."
    />
  ),
});
