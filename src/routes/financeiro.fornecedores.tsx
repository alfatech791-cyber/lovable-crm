import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/financeiro/fornecedores")({
  component: () => (
    <PagePlaceholder 
      title="Fornecedores" 
      subtitle="Contas a Pagar"
      description="Base de dados de fornecedores e controle de pagamentos pendentes por compra de estoque."
    />
  ),
});
