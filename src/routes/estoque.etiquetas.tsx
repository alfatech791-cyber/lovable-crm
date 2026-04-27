import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/estoque/etiquetas")({
  component: () => (
    <PagePlaceholder 
      title="Modelos de Etiquetas" 
      subtitle="Impressão e Identificação"
      description="Crie e imprima etiquetas com QR Code e IMEI para identificar seus aparelhos de forma profissional."
    />
  ),
});
