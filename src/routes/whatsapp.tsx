import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp — ConectaCRM" }, { name: "description", content: "Inbox unificado do WhatsApp" }] }),
  component: () => <PagePlaceholder title="WhatsApp" subtitle="Inbox unificado do WhatsApp" />,
});
