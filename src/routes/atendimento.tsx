import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/atendimento")({
  head: () => ({ meta: [{ title: "Atendimento — ConectaCRM" }, { name: "description", content: "Conversas em andamento" }] }),
  component: () => <PagePlaceholder title="Atendimento" subtitle="Conversas em andamento" />,
});
