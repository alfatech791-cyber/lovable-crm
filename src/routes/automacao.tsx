import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/automacao")({
  head: () => ({ meta: [{ title: "Automação — ConectaCRM" }, { name: "description", content: "Fluxos automatizados de mensagens" }] }),
  component: () => <PagePlaceholder title="Automação" subtitle="Fluxos automatizados de mensagens" />,
});
