import { createFileRoute } from "@tanstack/react-router";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { AppSidebar } from "@/components/layout/Sidebar";

export const Route = createFileRoute("/funil")({
  head: () => ({
    meta: [
      { title: "Funil de Vendas — ConectaCRM" },
      { name: "description", content: "Gerencie seus leads em um Kanban intuitivo inspirado no Kommo." },
    ],
  }),
  component: FunnelPage,
});

function FunnelPage() {
  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <KanbanBoard />
      </div>
    </div>
  );
}
