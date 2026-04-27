import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/financeiro")({
  component: () => (
    <PagePlaceholder 
      title="Financeiro" 
      subtitle="Gestão de Caixa e Bancos"
      description="Controle receitas, despesas, conciliação bancária e DRE gerencial focado na margem de lucro por aparelho vendido."
    />
  ),
});
