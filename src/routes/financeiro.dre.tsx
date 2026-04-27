import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/financeiro/dre")({
  component: () => (
    <PagePlaceholder 
      title="DRE Gerencial" 
      subtitle="Resultado da Operação"
      description="Veja o lucro real da sua loja descontando custos, impostos e despesas fixas. Saúde financeira em um clique."
    />
  ),
});
