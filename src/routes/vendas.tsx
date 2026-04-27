import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/vendas")({
  component: () => (
    <PagePlaceholder 
      title="Vendas" 
      subtitle="Gerencie suas vendas e faturamento"
      description="Aqui você poderá visualizar todas as vendas realizadas, gerenciar orçamentos e acompanhar o histórico de faturamento da sua loja de celulares."
    />
  ),
});
