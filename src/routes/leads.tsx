import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads — ConectaCRM" }, { name: "description", content: "Todos os contatos do seu CRM" }] }),
  component: () => <PagePlaceholder title="Leads" subtitle="Todos os contatos do seu CRM" />,
});
