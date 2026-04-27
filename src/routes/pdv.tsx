import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/pdv")({
  component: () => (
    <PagePlaceholder 
      title="Caixa (PDV)" 
      subtitle="Ponto de Venda Rápido"
      description="Interface otimizada para vendas rápidas no balcão, com consulta de estoque em tempo real e simulador de taxas de cartão integrados."
    />
  ),
});
