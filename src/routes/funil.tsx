import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/funil")({
  head: () => ({ meta: [{ title: "Funil de Vendas — ConectaCRM" }, { name: "description", content: "Acompanhe oportunidades por etapa" }] }),
  component: () => <PagePlaceholder title="Funil de Vendas" subtitle="Acompanhe oportunidades por etapa" />,
});
