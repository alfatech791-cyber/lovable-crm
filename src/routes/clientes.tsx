import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/clientes")({
  component: () => (
    <PagePlaceholder 
      title="Clientes" 
      subtitle="Base de dados unificada de clientes"
      description="Gerencie o perfil completo dos seus clientes, histórico de compras, programa de fidelidade e tags personalizadas para o nicho de smartphones."
    />
  ),
});
