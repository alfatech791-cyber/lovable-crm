import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/financeiro/caixa")({
  component: () => (
    <PagePlaceholder 
      title="Bancos e Caixas" 
      subtitle="Controle de Saldo"
      description="Gerencie suas contas bancárias, caixa físico da loja e faça a conciliação de entradas e saídas."
    />
  ),
});
