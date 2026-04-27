import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — ConectaCRM" }, { name: "description", content: "Métricas e exportações" }] }),
  component: () => <PagePlaceholder title="Relatórios" subtitle="Métricas e exportações" />,
});
