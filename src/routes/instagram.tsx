import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/instagram")({
  head: () => ({ meta: [{ title: "Instagram — ConectaCRM" }, { name: "description", content: "Mensagens e comentários do Instagram" }] }),
  component: () => <PagePlaceholder title="Instagram" subtitle="Mensagens e comentários do Instagram" />,
});
