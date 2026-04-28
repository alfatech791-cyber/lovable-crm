import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/whatsapp")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "WhatsApp — ConectaCRM" },
      { name: "description", content: "Gerencie suas conexões do WhatsApp via Evolution API." },
    ],
  }),
});