import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/estoque")({
  component: () => (
    <PagePlaceholder 
      title="Compras / Estoque" 
      subtitle="Gestão de Inventário e Fornecedores"
      description="Controle o estoque de aparelhos novos e usados por IMEI, modelos, cores e capacidades (GB). Gerencie ordens de compra e etiquetas."
    />
  ),
});
