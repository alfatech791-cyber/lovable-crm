import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/vendas/simulador")({
  component: () => (
    <PagePlaceholder 
      title="Simulador de Taxa de Cartão" 
      subtitle="Cálculo de Margem"
      description="Calcule as taxas das maquininhas (POS) e defina o melhor preço de venda para manter sua margem de lucro."
    />
  ),
});
