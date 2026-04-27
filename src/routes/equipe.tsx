import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/equipe")({
  head: () => ({ meta: [{ title: "Equipe — ConectaCRM" }, { name: "description", content: "Membros, papéis e permissões" }] }),
  component: () => <PagePlaceholder title="Equipe" subtitle="Membros, papéis e permissões" />,
});
