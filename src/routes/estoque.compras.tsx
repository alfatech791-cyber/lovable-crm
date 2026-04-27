import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/estoque/compras")({
  component: () => (
    <PagePlaceholder 
      title="Ordens de Compra" 
      subtitle="Reposição de Estoque"
      description="Gerencie seus pedidos aos fornecedores. Dê entrada automática no estoque ao receber os produtos."
    />
  ),
});
