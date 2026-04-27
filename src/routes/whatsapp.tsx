import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — ConectaCRM" },
      { name: "description", content: "Gerencie suas conexões do WhatsApp via Evolution API." },
    ],
  }),
});