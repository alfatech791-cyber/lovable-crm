import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/vendas/delivery")({
  component: () => (
    <PagePlaceholder 
      title="Delivery" 
      subtitle="Gestão de Entregas"
      description="Acompanhe os pedidos que saíram para entrega. Integre com motoboys e envie o status via WhatsApp."
    />
  ),
});
