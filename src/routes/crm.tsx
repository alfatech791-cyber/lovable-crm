import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/crm")({
  component: () => (
    <PagePlaceholder 
      title="CRM / Leads" 
      subtitle="Pipeline de Vendas WhatsApp & Instagram"
      description="Centralize seus atendimentos, gerencie leads via funil Kanban e automatize respostas com a IA treinada em vendas de celulares."
    />
  ),
});
