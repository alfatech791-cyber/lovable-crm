import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — ConectaCRM" }, { name: "description", content: "Conta, integrações e preferências" }] }),
  component: () => <PagePlaceholder title="Configurações" subtitle="Conta, integrações e preferências" />,
});
